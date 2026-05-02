require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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
        const { messages } = req.body;
        let replyText = "I can help you navigate the system, book or cancel slots, and filter rooms. What can I do for you today?";
        let clientActions = [];
        
        try {
            const userText = messages[messages.length - 1].content.toLowerCase();
            if (userText.includes("rooms") || userText.includes("classrooms") || userText.includes("labs")) {
                replyText = "Sure, I've filtered the rooms view for you.";
                clientActions.push({ action: 'navigateTo', data: { page: 'rooms' } });
                if (userText.includes("lab")) {
                    clientActions.push({ action: 'filterRooms', data: { type: 'Lab' } });
                } else if (userText.includes("classroom")) {
                    clientActions.push({ action: 'filterRooms', data: { type: 'Classroom' } });
                }
            } else if (userText.includes("my bookings") || userText.includes("schedule")) {
                replyText = "Here are your current bookings.";
                clientActions.push({ action: 'navigateTo', data: { page: 'my-bookings' } });
            } else if (userText.includes("absent") || userText.includes("absence")) {
                replyText = "Let me take you to the absences page so you can mark yourself absent.";
                clientActions.push({ action: 'navigateTo', data: { page: 'absences' } });
            } else if (userText.includes("profile") || userText.includes("settings")) {
                replyText = "Opening settings.";
                clientActions.push({ action: 'navigateTo', data: { page: 'settings' } });
            } else if (userText.includes("book") || userText.includes("301") || userText.includes("302")) {
                replyText = "Opening the booking modal for that room.";
                clientActions.push({ action: 'bookSlot', data: { room: '302', day: 'Tuesday', time: '09:45-10:45' } });
            }
        } catch (e) {}

        res.json({
            reply: {
                role: "assistant",
                content: replyText
            },
            hasMutation: false,
            clientActions: clientActions
        });
    } catch (err) {
        res.json({
            reply: {
                role: "assistant",
                content: "I can help you navigate the system, book or cancel slots, and filter rooms. What can I do for you today?"
            },
            hasMutation: false
        });
    }
});
// Email Reminder Endpoint
app.post('/api/send-reminder', async (req, res) => {
    try {
        const { toEmail, subject, body } = req.body;
        
        const emailUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim().replace(/^["']|["']$/g, '') : null;
        const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim().replace(/^["']|["']$/g, '') : null;

        // If credentials are not set, don't crash
        if (!emailUser || !emailPass || emailUser === 'your_email@gmail.com') {
            console.log("Email credentials not configured. Skipping actual send.");
            return res.json({ success: true, message: "Simulated email send (credentials missing)" });
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this if not using gmail
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        let info = await transporter.sendMail({
            from: `"BookSpace Assistant" <${emailUser}>`,
            to: toEmail,
            subject: subject,
            text: body,
        });

        console.log("Message sent: %s", info.messageId);
        res.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email: " + error.message });
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
