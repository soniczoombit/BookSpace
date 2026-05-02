require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const path = require('path');

// Serve static files (CSS, Client-side JS, etc.)
app.use(express.static(__dirname));

// Route for the main application (removes .html from URL)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize Supabase backend
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
let supabase;
if (supabaseUrl && supabaseKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
    } catch (e) {
        console.error("Supabase creation error", e);
    }
}

let openai;
if (process.env.GEMINI_API_KEY) {
    try {
        openai = new OpenAI({ 
            apiKey: process.env.GEMINI_API_KEY,
            baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
        });
    } catch (e) {
        console.error("OpenAI creation error", e);
    }
}

// Mock Database for Users (For Presentation)
const usersDb = [
    { name: "Prof. Vaibhav Godbole", email: "vaibhav.godbole@fragnel.edu", password: "universe", role: "faculty" },
    { name: "Mr. Breyon Rodrigues", email: "breyonrodrigues2@gmail.com", password: "universe", role: "faculty" },
    { name: "Dr. Swapnali Makdey", email: "swapnali.makdey@fragnel.edu", password: "universe", role: "admin" } // Head of Department (Admin)
];

let disabledRooms = [];

/**
 * API ROUTES
 */

app.get('/api/disabled-rooms', async (req, res) => {
    try {
        if (!supabase) {
            return res.json(disabledRooms);
        }
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('room', 'DISABLED_ROOM');
        
        if (error) throw error;
        const disabled = data.map(b => b.day);
        res.json(disabled);
    } catch (err) {
        res.json(disabledRooms);
    }
});

app.post('/api/disable-room', async (req, res) => {
    const { room } = req.body;
    try {
        if (room && !disabledRooms.includes(room)) {
            disabledRooms.push(room);
        }
        if (supabase && room) {
            await supabase.from('bookings').insert([{
                room: 'DISABLED_ROOM',
                day: room,
                time: 'ALL',
                user_email: 'swapnali.makdey@fragnel.edu',
                user_name: 'Admin'
            }]);
        }
        res.json({ success: true, disabledRooms });
    } catch (err) {
        res.json({ success: true, disabledRooms });
    }
});

app.post('/api/enable-room', async (req, res) => {
    const { room } = req.body;
    try {
        disabledRooms = disabledRooms.filter(r => r !== room);
        if (supabase && room) {
            await supabase
                .from('bookings')
                .delete()
                .eq('room', 'DISABLED_ROOM')
                .eq('day', room);
        }
        res.json({ success: true, disabledRooms });
    } catch (err) {
        res.json({ success: true, disabledRooms });
    }
});

// Login Route
app.get('/api/check-email', (req, res) => {
    const { email } = req.query;
    const user = usersDb.find(u => u.email === email);
    if (user) {
        res.json({ exists: true });
    } else {
        res.json({ exists: false });
    }
});

app.post('/api/signup', (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: "Missing email, password, or name" });
    }
    const existing = usersDb.find(u => u.email === email);
    if (existing) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }
    
    const newUser = { name, email, password, role: "faculty" };
    usersDb.push(newUser);
    res.status(201).json({ success: true, user: { name: newUser.name, email: newUser.email, role: newUser.role } });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = usersDb.find(u => u.email === email && u.password === password);
    
    if (user) {
        res.json({ success: true, user: { name: user.name, email: user.email, role: user.role || "faculty" } });
    } else {
        res.status(401).json({ success: false, message: "Invalid email or password" });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: "Server is connected to Supabase." });
});

let localBookings = [];
let localAbsences = [];

// Get all bookings
app.get('/api/bookings', async (req, res) => {
    try {
        if (!supabase) {
            return res.json(localBookings.filter(b => b.room !== 'DISABLED_ROOM'));
        }
        const { data, error } = await supabase.from('bookings').select('*');
        if (error) throw error;
        res.json(data.filter(b => b.room !== 'DISABLED_ROOM'));
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// Add a new booking
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = req.body;
        delete newBooking.id; // Let Supabase generate a proper UUID
        
        if (!supabase) {
            newBooking.id = Date.now().toString();
            localBookings.push(newBooking);
            return res.status(201).json({ message: "Booking saved", booking: newBooking });
        }

        const { data, error } = await supabase
            .from('bookings')
            .insert([newBooking])
            .select();
        
        if (error) throw error;
        res.status(201).json({ message: "Booking saved", booking: data[0] });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a booking
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        if (!supabase) {
            localBookings = localBookings.filter(b => b.id !== req.params.id);
            return res.json({ message: "Booking removed successfully" });
        }

        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', req.params.id);
            
        if (error) throw error;
        res.json({ message: "Booking removed successfully" });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// Get all absences
app.get('/api/absences', async (req, res) => {
    try {
        if (!supabase) {
            return res.json(localAbsences);
        }
        const { data, error } = await supabase.from('absences').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch absences" });
    }
});

// Add a new absence
app.post('/api/absences', async (req, res) => {
    try {
        const newAbsence = req.body;
        delete newAbsence.id; // Let Supabase generate a proper UUID

        if (!supabase) {
            newAbsence.id = Date.now().toString();
            localAbsences.push(newAbsence);
            return res.status(201).json({ message: "Absence saved", absence: newAbsence });
        }

        const { data, error } = await supabase
            .from('absences')
            .insert([newAbsence])
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Absence saved", absence: data[0] });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an absence
app.delete('/api/absences/:id', async (req, res) => {
    try {
        if (!supabase) {
            localAbsences = localAbsences.filter(a => a.id !== req.params.id);
            return res.json({ message: "Absence removed successfully" });
        }

        const { error } = await supabase
            .from('absences')
            .delete()
            .eq('id', req.params.id);
            
        if (error) throw error;
        res.json({ message: "Absence removed successfully" });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});


// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
    try {
        if (!openai) {
            return res.json({
                reply: {
                    role: "assistant",
                    content: "I am having trouble connecting to my brain because the Gemini API key is missing. Please add the GEMINI_API_KEY environment variable to Vercel and redeploy."
                },
                hasMutation: false
            });
        }

        const { messages, userContext } = req.body;
        
        const isLoggedIn = userContext.isLoggedIn;

        let systemPrompt = `You are the BookSpace AI Assistant. You help faculty manage room bookings.
You have access to: Navigation functions, Booking functions, Cancellation functions, Filter functions, Current app state.

You must:
- Be short, clear, and professional.
- Execute actions immediately when the user intent maps to them.
- If the user asks to see all labs or classrooms, chain navigateTo(page="rooms") and filterRooms(type="Lab" or "Classroom").
- If the user wants to see their existing bookings, use navigateTo(page="my-bookings").
- If the user wants to view their profile, change settings, or manage their theme, use navigateTo(page="settings").
- If the user wants to schedule an absence, manage absences, or mark themselves absent, use navigateTo(page="absences"). Do not take them to settings.
- Chain actions together in the tool_calls list so that they happen concurrently or sequentially on the client side.

Current State:
Logged in: ${isLoggedIn}
Current User: ${userContext.name}
Current Page: ${userContext.currentPage}
Current Timetable: ${JSON.stringify(userContext.timetable)}
Existing Manual Bookings: ${JSON.stringify(userContext.bookings)}
Absences: ${JSON.stringify(userContext.absences)}
Available Rooms: ${JSON.stringify(userContext.rooms)}

If the user is NOT logged in:
- You must ONLY answer general queries.
- You CANNOT book rooms, cancel bookings, or modify anything.
- If they ask to perform a protected action, respond exactly with: "Please login to perform this action"

If the user is logged in:
- You can book rooms, cancel bookings, navigate to any page, and filter rooms.
- Pages available: "dashboard", "rooms", "my-bookings", "absences", "settings".
- Be conversational and highly concise.`;

        let tools = [];

        if (isLoggedIn) {
            tools = [
                {
                    type: "function",
                    function: {
                        name: "book_room",
                        description: "Open the booking modal with prefilled data for a room, day, and time.",
                        parameters: {
                            type: "object",
                            properties: {
                                room: { type: "string" },
                                day: { type: "string" },
                                time: { type: "string", description: "e.g., 10:45-11:00" },
                            },
                            required: ["room", "day", "time"],
                        },
                    },
                },
                {
                    type: "function",
                    function: {
                        name: "cancel_booking",
                        description: "Trigger cancel logic for a booking ID.",
                        parameters: {
                            type: "object",
                            properties: {
                                booking_id: { type: "string", description: "The UUID of the booking" }
                            },
                            required: ["booking_id"],
                        },
                    },
                },
                {
                    type: "function",
                    function: {
                        name: "navigateTo",
                        description: "Automatically navigate to a specific section/page.",
                        parameters: {
                            type: "object",
                            properties: {
                                page: { type: "string", enum: ["dashboard", "rooms", "my-bookings", "settings", "absences"], description: "The page to navigate to" }
                            },
                            required: ["page"],
                        },
                    },
                },
                {
                    type: "function",
                    function: {
                        name: "filterRooms",
                        description: "Filter rooms to show only a specific type.",
                        parameters: {
                            type: "object",
                            properties: {
                                type: { type: "string", enum: ["All", "Classroom", "Lab"], description: "The type of rooms to filter by" }
                            },
                            required: ["type"],
                        },
                    },
                },
                {
                    type: "function",
                    function: {
                        name: "openSchedule",
                        description: "Open the weekly schedule modal for a specific room.",
                        parameters: {
                            type: "object",
                            properties: {
                                roomId: { type: "string", description: "The room ID to view schedule for" }
                            },
                            required: ["roomId"],
                        },
                    },
                },
                {
                    type: "function",
                    function: {
                        name: "navigate_to_absences",
                        description: "Navigate to the My Absences page where the user can mark themselves absent.",
                        parameters: {
                            type: "object",
                            properties: {},
                        },
                    },
                }
            ];
        }

        const payload = {
            model: "gemini-2.5-flash",
            messages: [{ role: "system", content: systemPrompt }, ...messages]
        };

        if (tools.length > 0) {
            payload.tools = tools;
        }

        const response = await openai.chat.completions.create(payload);
        const responseMessage = response.choices[0].message;
        
        if (responseMessage.tool_calls) {
            let clientActions = [];

            for (const toolCall of responseMessage.tool_calls) {
                const args = JSON.parse(toolCall.function.arguments);
                const fnName = toolCall.function.name;

                if (fnName === 'book_room') {
                    clientActions.push({ action: 'bookSlot', data: args });
                } else if (fnName === 'cancel_booking') {
                    clientActions.push({ action: 'cancelBooking', data: { id: args.booking_id } });
                } else if (fnName === 'navigateTo') {
                    clientActions.push({ action: 'navigateTo', data: { page: args.page } });
                } else if (fnName === 'filterRooms') {
                    clientActions.push({ action: 'filterRooms', data: { type: args.type } });
                } else if (fnName === 'openSchedule') {
                    clientActions.push({ action: 'openSchedule', data: { roomId: args.roomId } });
                } else if (fnName === 'navigate_to_absences') {
                    clientActions.push({ action: 'navigateTo', data: { page: 'absences' } });
                }
            }
            
            res.json({
                reply: {
                    role: "assistant",
                    content: responseMessage.content || "I have initiated that action for you."
                },
                hasMutation: false,
                clientActions: clientActions
            });
        } else {
            res.json({ reply: responseMessage, hasMutation: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Chat processing failed" });
    }
});
// Email Reminder Endpoint
app.post('/api/send-reminder', async (req, res) => {
    try {
        const { toEmail, subject, body } = req.body;
        
        // If credentials are not set, don't crash
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'your_email@gmail.com') {
            console.log("Email credentials not configured. Skipping actual send.");
            return res.json({ success: true, message: "Simulated email send (credentials missing)" });
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this if not using gmail
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from: `"BookSpace Assistant" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: subject,
            text: body,
        });

        console.log("Message sent: %s", info.messageId);
        res.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// Start server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Backend server running at http://localhost:${PORT}`);
        console.log(`Note: Connected directly to Supabase Postgres Cloud Database!`);
    });
}

module.exports = app;
