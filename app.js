/**
 * BookSpace Dashboard Logic
 */

// --- 1. STATE MANAGEMENT ---

const facultyMap = {
  SY: "Dr. Sunil Yadav",
  IK: "Dr. Inderkumar Kochar",
  AP: "Ms. Annivia Pereira",
  GJ: "Ms. Gauree Jagushte",
  AL: "Ms. Archana Lopes",
  PKP: "Ms. Prachi Patil",
  BJ: "Ms. Binsy Joseph",
  SB: "Dr. Sushmita Banerjee",
  SP: "Dr. K. Sailakshmi Parvathi",
  PKB: "Dr. Prajakta Bhangale",
  DVB: "Dr. D. V. Bhoir",
  AB: "Ms. Aastha Bhatia",
  VVG: "Mr. Vaibhav Godbole",
  SAM: "Dr. Swapnali Makdey",
  JM: "Mr. Jayen Modi",
  VBR: "Dr. M. V. Rao",
  AT: "Dr. Abhijit Tanksale",
  DAB: "Dr. Dipak Bauskar",
  PNL: "Dr. Prasad Lalit"
};

const timetable = {
  monday: [
    { time: "08:45-10:45", room: "303", subject: "DE", faculty: "Dr. Inderkumar Kochar" },
    { time: "11:00-12:00", room: "302", subject: "IKS", faculty: "Prof. Annevia Pereira" },
    { time: "12:00-13:00", room: "302", subject: "ICPT", faculty: "Prof. Gauree Jagushte" },
    { time: "08:45-09:45", room: "309", subject: "AE", faculty: "Prof. Jayen Modi" },
    { time: "08:45-09:45", room: "310", subject: "WT", faculty: "Prof. Vaibhav Godbole" },
    { time: "08:45-09:45", room: "311", subject: "DS", faculty: "Prof. Archana Lopes" },
    { time: "11:00-13:00", room: "307", subject: "PCB-QA", faculty: "Dr. Prasad Lalit" },
    { time: "13:30-14:30", room: "307", subject: "MNM", faculty: "Dr. PVS" },
    { time: "08:45-09:45", room: "306", subject: "AVLSI", faculty: "Dr. Swapnali Makdey" },
    { time: "08:45-09:45", room: "307", subject: "BDA", faculty: "Dr. Prajakta Bhangale" },
    { time: "09:45-10:45", room: "306", subject: "ADC", faculty: "Dr. Sailakshmi Parvathi" },
    { time: "11:00-13:00", room: "312", subject: "VLSI Lab", faculty: "Dr. Deepak Bhoir" },
    { time: "11:00-13:00", room: "301", subject: "ADC Lab", faculty: "Dr. Sailakshmi Parvathi" },
    { time: "11:00-13:00", room: "310", subject: "ML Lab", faculty: "Prof. Vaibhav Godbole" },
    { time: "11:00-13:00", room: "311", subject: "SS Lab", faculty: "Dr. Prajakta Bhangale" },
    { time: "13:30-15:30", room: "303", subject: "DSP Lab", faculty: "Dr. Inderkumar Kochar" },
    { time: "13:30-15:30", room: "312", subject: "AVLSI Lab", faculty: "Dr. Swapnali Makdey" },
    { time: "13:30-15:30", room: "310", subject: "NLP Lab", faculty: "Prof. Annevia Pereira" },
    { time: "13:30-15:30", room: "311", subject: "BDA Lab", faculty: "Dr. Prajakta Bhangale" }
  ],
  tuesday: [
    { time: "09:45-10:45", room: "302", subject: "BEEE", faculty: "Prof. Bincy Joseph" },
    { time: "11:00-12:00", room: "302", subject: "ICPT", faculty: "Prof. Gauree Jagushte" },
    { time: "12:00-13:00", room: "302", subject: "HHS", faculty: "Dr. Joseph Rodrigues" },
    { time: "08:45-09:45", room: "307", subject: "DSAT", faculty: "Prof. Vaibhav Godbole" },
    { time: "09:45-10:45", room: "307", subject: "AE", faculty: "Prof. Jayen Modi" },
    { time: "11:00-12:00", room: "307", subject: "DS", faculty: "Prof. Archana Lopes" },
    { time: "12:00-13:00", room: "307", subject: "TE", faculty: "Dr. Abhijit Tanksale" },
    { time: "08:45-09:45", room: "306", subject: "NLP", faculty: "Prof. Annevia Pereira" },
    { time: "08:45-09:45", room: "302", subject: "DSP", faculty: "Dr. Inderkumar Kochar" },
    { time: "09:45-10:45", room: "306", subject: "VLSI", faculty: "Dr. Deepak Bhoir" },
    { time: "11:00-13:00", room: "312", subject: "CAD Lab", faculty: "Dr. Deepak Bhoir" },
    { time: "11:00-13:00", room: "310", subject: "ML Lab", faculty: "Prof. Vaibhav Godbole" },
    { time: "11:00-13:00", room: "311", subject: "SS Lab", faculty: "Dr. Prajakta Bhangale" },
    { time: "11:00-13:00", room: "309", subject: "DAP Lab", faculty: "Prof. Jayen Modi" }
  ],
  wednesday: [
    { time: "08:45-09:45", room: "302", subject: "EC", faculty: "Dr. Sunil Yadav" },
    { time: "09:45-10:45", room: "302", subject: "DE", faculty: "Dr. Sailakshmi Parvathi" },
    { time: "11:00-13:00", room: "303", subject: "DE Lab", faculty: "Dr. Inderkumar Kochar" },
    { time: "08:45-10:45", room: "309", subject: "AE Lab", faculty: "Prof. Jayen Modi" },
    { time: "08:45-10:45", room: "310", subject: "WT Lab", faculty: "Prof. Vaibhav Godbole" },
    { time: "08:45-10:45", room: "311", subject: "DS Lab", faculty: "Prof. Archana Lopes" },
    { time: "11:00-12:00", room: "307", subject: "PCB", faculty: "Prof. Aastha Bhatia" },
    { time: "12:00-13:00", room: "307", subject: "DS", faculty: "Prof. Archana Lopes" },
    { time: "08:45-10:45", room: "306", subject: "HONORS", faculty: "—" },
    { time: "11:00-13:00", room: "310", subject: "ML Lab", faculty: "Prof. Vaibhav Godbole" },
    { time: "11:00-13:00", room: "311", subject: "SS Lab", faculty: "Dr. Prajakta Bhangale" },
    { time: "11:00-13:00", room: "312", subject: "CAD Lab", faculty: "Dr. Deepak Bhoir" },
    { time: "13:30-15:30", room: "303", subject: "IoT Lab", faculty: "Dr. Sailakshmi Parvathi" },
    { time: "13:30-15:30", room: "310", subject: "IP Lab", faculty: "Prof. Annevia Pereira" },
    { time: "13:30-15:30", room: "311", subject: "DL Lab", faculty: "Dr. Sushmita Banerjee" }
  ],
  thursday: [
    { time: "11:00-12:00", room: "302", subject: "DE", faculty: "Dr. Sailakshmi Parvathi" },
    { time: "12:00-13:00", room: "302", subject: "BEEE", faculty: "Prof. Bincy Joseph" },
    { time: "13:30-15:30", room: "303", subject: "DE Lab", faculty: "Dr. Inderkumar Kochar" },
    { time: "08:45-09:45", room: "307", subject: "DSAT", faculty: "Prof. Vaibhav Godbole" },
    { time: "09:45-10:45", room: "307", subject: "AE", faculty: "Prof. Jayen Modi" },
    { time: "11:00-12:00", room: "307", subject: "DS", faculty: "Prof. Archana Lopes" },
    { time: "12:00-13:00", room: "307", subject: "MNM", faculty: "Dr. PVS" },
    { time: "08:45-10:45", room: "303", subject: "IoT Lab", faculty: "Dr. Sailakshmi Parvathi" },
    { time: "08:45-10:45", room: "310", subject: "IP Lab", faculty: "Prof. Annevia Pereira" },
    { time: "08:45-10:45", room: "311", subject: "DL Lab", faculty: "Dr. Sushmita Banerjee" },
    { time: "11:00-13:00", room: "311", subject: "STQA Lab", faculty: "Dr. Sushmita Banerjee" },
    { time: "13:30-14:30", room: "306", subject: "ADC", faculty: "Dr. Sailakshmi Parvathi" },
    { time: "14:30-15:30", room: "306", subject: "VLSI", faculty: "Dr. Deepak Bhoir" }
  ],
  friday: [
    { time: "08:45-09:45", room: "302", subject: "IKS", faculty: "Prof. Annevia Pereira" },
    { time: "09:45-10:45", room: "302", subject: "BEEE", faculty: "Prof. Bincy Joseph" },
    { time: "11:00-12:00", room: "302", subject: "EC", faculty: "Dr. Sunil Yadav" },
    { time: "12:00-13:00", room: "302", subject: "ICPT", faculty: "Prof. Gauree Jagushte" },
    { time: "08:45-10:45", room: "309", subject: "AE Lab", faculty: "Prof. Jayen Modi" },
    { time: "08:45-10:45", room: "310", subject: "WT Lab", faculty: "Prof. Vaibhav Godbole" },
    { time: "08:45-10:45", room: "311", subject: "DS Lab", faculty: "Prof. Archana Lopes" },
    { time: "11:00-12:00", room: "307", subject: "TE", faculty: "Dr. Abhijit Tanksale" },
    { time: "12:00-13:00", room: "307", subject: "DSAT", faculty: "Prof. Vaibhav Godbole" },
    { time: "08:45-09:45", room: "306", subject: "NLP", faculty: "Prof. Annevia Pereira" },
    { time: "08:45-09:45", room: "307", subject: "DSP", faculty: "Dr. Inderkumar Kochar" },
    { time: "09:45-10:45", room: "306", subject: "AVLSI", faculty: "Dr. Swapnali Makdey" },
    { time: "09:45-10:45", room: "307", subject: "BDA", faculty: "Dr. Prajakta Bhangale" },
    { time: "11:00-13:00", room: "312", subject: "CAD Lab", faculty: "Dr. Deepak Bhoir" },
    { time: "11:00-13:00", room: "309", subject: "DAP Lab", faculty: "Prof. Jayen Modi" },
    { time: "11:00-13:00", room: "311", subject: "STQA Lab", faculty: "Dr. Sushmita Banerjee" },
    { time: "13:30-15:30", room: "303", subject: "DSP Lab", faculty: "Dr. Inderkumar Kochar" }
  ]
};

const state = {
    user: {
        name: "Mr. Vaibhav Godbole",
        email: "vaibhav.godbole@fragnel.edu",
        role: "Faculty",
        department: "Electronics & Computer Science (ECS)",
        avatar: "VG"
    },
    rooms: [
        { id: "302", type: "Classroom", floor: "3rd Floor", dept: "ECS Dept", isLab: false },
        { id: "306", type: "Classroom", floor: "3rd Floor", dept: "ECS Dept", isLab: false },
        { id: "307", type: "Classroom", floor: "3rd Floor", dept: "ECS Dept", isLab: false },
        { id: "303", type: "Electronics Laboratory", floor: "3rd Floor", dept: "ECS Dept", isLab: true },
        { id: "309", type: "Electronics Laboratory", floor: "3rd Floor", dept: "ECS Dept", isLab: true },
        { id: "301", type: "Computer Laboratory", floor: "3rd Floor", dept: "ECS Dept", isLab: true },
        { id: "310", type: "Computer Laboratory", floor: "3rd Floor", dept: "ECS Dept", isLab: true },
        { id: "311", type: "Computer Laboratory", floor: "3rd Floor", dept: "ECS Dept", isLab: true },
        { id: "312", type: "Computer Laboratory", floor: "3rd Floor", dept: "ECS Dept", isLab: true }
    ],
    // Bookings Array populated asynchronously
    bookings: [],
    absences: [],

    // Structure for generating Schedule table
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    timeSlots: [
        { time: "8:45–9:45", isBreak: false },
        { time: "9:45–10:45", isBreak: false },
        { time: "10:45–11:00", isBreak: true, label: "SHORT BREAK" },
        { time: "11:00–12:00", isBreak: false },
        { time: "12:00–1:00", isBreak: false },
        { time: "1:00–1:30", isBreak: true, label: "LUNCH BREAK" },
        { time: "1:30–2:30", isBreak: false },
        { time: "2:30–3:30", isBreak: false }
    ],

    tempBookingData: null, // Stores pending booking info for modal
    currentRoomFilter: "All",
    reminderSetting: localStorage.getItem("bookspace_reminder") || "10min",
    isLoggedIn: false,
    currentPage: "dashboard"
};

const FALLBACK_BOOKINGS = [
    { id: "b1", room: "306", faculty: "Dr. Deepak Bhoir", day: "Monday", time: "1:30–2:30" },
    { id: "b2", room: "307", faculty: "Dr. K. Sailakshmi Parvathi", day: "Tuesday", time: "11:00–12:00" },
    { id: "b3", room: "302", faculty: "Mr. Vaibhav Godbole", day: "Wednesday", time: "1:30–2:30" },
    { id: "b4", room: "306", faculty: "Ms. Bincy Joseph", day: "Thursday", time: "2:30–3:30" },
    { id: "b5", room: "307", faculty: "Dr. Inderkumar Kochar", day: "Monday", time: "12:00–1:00" }
];


const parseTimeStr = (str) => {
    let [h, m] = str.split(":");
    h = parseInt(h); m = parseInt(m);
    if (h < 8 && h > 0) h += 12; 
    return h * 60 + m;
};

const doSlotsOverlap = (t1, t2) => {
    t1 = t1.replace(/-/g, "–");
    t2 = t2.replace(/-/g, "–");
    const s1 = t1.split("–");
    const s2 = t2.split("–");
    if (s1.length!==2 || s2.length!==2) return false;
    const start1 = parseTimeStr(s1[0]); const end1 = parseTimeStr(s1[1]);
    const start2 = parseTimeStr(s2[0]); const end2 = parseTimeStr(s2[1]);
    return Math.max(start1, start2) < Math.min(end1, end2);
};

function areFacultyNamesEqual(name1, name2) {
    if (!name1 || !name2) return false;
    const normalize = (name) => {
        return name
            .toLowerCase()
            .replace(/\b(dr|mr|ms|mrs|prof|prof\.|mr\.|ms\.|dr\.)\b/gi, "")
            .replace(/[^a-z]/gi, "")
            .trim();
    };
    return normalize(name1) === normalize(name2);
}

function getSlotStatus(roomId, day, slotTime) {
    const dayKey = day.toLowerCase();
    
    // 1. Check Timetable
    if (timetable[dayKey]) {
        const timeTableSlot = timetable[dayKey].find(t => t.room === roomId && doSlotsOverlap(t.time, slotTime));
        if (timeTableSlot) {
            // Check if faculty is absent
            const isAbsent = state.absences.some(a => areFacultyNamesEqual(a.faculty, timeTableSlot.faculty) && a.day === day);
            if (!isAbsent) {
                return { status: 'TIMETABLE', details: timeTableSlot };
            }
        }
    }
    
    // 2. Check Manual Bookings
    const manualBooking = state.bookings.find(b => b.room === roomId && b.day === day && doSlotsOverlap(b.time, slotTime));
    if (manualBooking) {
        return { status: 'BOOKED', details: manualBooking };
    }
    
    return { status: 'AVAILABLE' };
}

const API_BASE = window.location.origin.includes("localhost") 
    ? "http://localhost:3000/api" 
    : `${window.location.origin}/api`;

async function fetchBookings() {
    try {
        const res = await fetch(`${API_BASE}/bookings`);
        if (!res.ok) throw new Error("Offline");
        state.bookings = await res.json();
        return true;
    } catch (e) {
        const localData = localStorage.getItem("bookspace_bookings");
        if (localData) {
            state.bookings = JSON.parse(localData);
        } else {
            state.bookings = [...FALLBACK_BOOKINGS];
            localStorage.setItem("bookspace_bookings", JSON.stringify(state.bookings));
        }
        return false;
    }
}

let disabledRooms = [];
try {
    const localDisabled = localStorage.getItem("bookspace_disabled_rooms");
    if (localDisabled) {
        disabledRooms = JSON.parse(localDisabled);
    }
} catch (e) {
    console.error(e);
}

async function fetchDisabledRooms() {
    try {
        const res = await fetch(`${API_BASE}/disabled-rooms`);
        if (res.ok) {
            disabledRooms = await res.json();
            localStorage.setItem("bookspace_disabled_rooms", JSON.stringify(disabledRooms));
        }
    } catch (e) {
        console.error("Offline fetching disabled rooms", e);
    }
}

async function apiAddBooking(booking) {
    try {
        const res = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        });
        if (res.ok) {
            const data = await res.json();
            return data.booking;
        }
        return false;
    } catch (e) { return false; }
}

async function apiDeleteBooking(id) {
    try {
        const res = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (e) { return false; }
}

async function fetchAbsences() {
    try {
        const res = await fetch(`${API_BASE}/absences`);
        if (!res.ok) throw new Error("Offline");
        state.absences = await res.json();
        return true;
    } catch (e) { return false; }
}

async function apiAddAbsence(absence) {
    try {
        const res = await fetch(`${API_BASE}/absences`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(absence)
        });
        if (res.ok) {
            const data = await res.json();
            return data.absence;
        }
        return false;
    } catch (e) { return false; }
}

async function apiDeleteAbsence(id) {
    try {
        const res = await fetch(`${API_BASE}/absences/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (e) { return false; }
}

const theme = localStorage.getItem("bookspace_theme");
// If not explicitly set to Dark, default to Light (nothing).
if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
} else {
    document.documentElement.removeAttribute("data-theme");
}

function isRoomOccupiedNow(roomId) {
    const now = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = dayNames[now.getDay()];
    
    if (currentDay === "Sunday" || currentDay === "Saturday") return false;
    
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let activeSlotTime = null;
    for (const slot of state.timeSlots) {
        if (slot.isBreak) continue;
        const times = slot.time.replace(/-/g, "–").split("–");
        if (times.length !== 2) continue;
        const start = parseTimeStr(times[0]);
        const end = parseTimeStr(times[1]);
        if (currentMinutes >= start && currentMinutes < end) {
            activeSlotTime = slot.time;
            break;
        }
    }

    if (!activeSlotTime) return false;

    const status = getSlotStatus(roomId, currentDay, activeSlotTime);
    return status.status !== 'AVAILABLE';
}

// --- DOM ELEMENTS ---
const viewLogin = document.getElementById("login-view");
const viewApp = document.getElementById("app-view");
const loginForm = document.getElementById("login-form");
const btnSignout = document.getElementById("btn-signout");
const sidebarLinks = document.querySelectorAll(".sidebar-menu .menu-item");
const pageViews = document.querySelectorAll(".page-view");
const welcomeName = document.getElementById("welcome-name");

// Modals
const modalSchedule = document.getElementById("modal-schedule");
const modalConfirm = document.getElementById("modal-confirm");
const btnCloseModals = document.querySelectorAll(".modal-close");
const btnCancelConfirm = document.getElementById("btn-cancel-confirm");
const btnSubmitConfirm = document.getElementById("btn-submit-confirm");


// --- 2. AUTHENTICATION & NAVIGATION ---

const togglePasswordBtn = document.getElementById("toggle-password");
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
        const passwordInput = document.getElementById("password");
        const icon = togglePasswordBtn.querySelector("i");
        
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            icon.classList.remove("ph-eye");
            icon.classList.add("ph-eye-slash");
        } else {
            passwordInput.type = "password";
            icon.classList.remove("ph-eye-slash");
            icon.classList.add("ph-eye");
        }
    });
}

const emailInput = document.getElementById("email");
const signupExtraFields = document.getElementById("signup-extra-fields");
const submitBtn = document.getElementById("login-submit-btn");

let isNewUser = false;

async function checkAndConfigureSignupFlow() {
    const email = emailInput ? emailInput.value.trim() : "";
    if (!email) return;
    try {
        let data;
        if (email.toLowerCase() === "swapnali.makdey@fragnel.edu") {
            data = { exists: true };
        } else {
            const res = await fetch(`${API_BASE}/check-email?email=${encodeURIComponent(email)}`);
            data = await res.json();
        }

        if (!data.exists) {
            isNewUser = true;
            signupExtraFields.style.display = "block";
            submitBtn.textContent = "Sign Up & Sign In";
        } else {
            isNewUser = false;
            signupExtraFields.style.display = "none";
            submitBtn.textContent = "Sign In";
        }
    } catch (err) {
        console.error("Error checking email", err);
    }
}

if (emailInput) {
    emailInput.addEventListener("blur", checkAndConfigureSignupFlow);
    emailInput.addEventListener("input", checkAndConfigureSignupFlow);
    emailInput.addEventListener("change", checkAndConfigureSignupFlow);
}

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        let checkData;
        if (email.toLowerCase() === "swapnali.makdey@fragnel.edu") {
            checkData = { exists: true };
        } else {
            const checkRes = await fetch(`${API_BASE}/check-email?email=${encodeURIComponent(email)}`);
            checkData = await checkRes.json();
        }
        
        if (!checkData.exists && !isNewUser) {
            isNewUser = true;
            signupExtraFields.style.display = "block";
            submitBtn.textContent = "Sign Up & Sign In";
            showToast("New user detected! Please set your name and password.");
            return;
        }
    } catch (err) {
        console.error("Failed to check email", err);
    }

    if (isNewUser) {
        const fullName = document.getElementById("fullName").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        
        if (!fullName) {
            showToast("Please enter your full name.");
            return;
        }
        if (password !== confirmPassword) {
            showToast("Passwords do not match.");
            return;
        }

        try {
            const signupRes = await fetch(`${API_BASE}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name: fullName })
            });
            const signupData = await signupRes.json();
            if (!signupData.success) {
                showToast(signupData.message || "Signup failed.");
                return;
            }
            showToast("Account created successfully!");
            isNewUser = false;
        } catch (err) {
            showToast("Error creating account.");
            return;
        }
    }

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        let data;
        if (res.ok) {
            data = await res.json();
        } else {
            // Check fallback for direct login
            if (email.toLowerCase() === "swapnali.makdey@fragnel.edu" && password === "universe") {
                data = { success: true, user: { name: "Dr. Swapnali Makdey", email: "swapnali.makdey@fragnel.edu", role: "admin" } };
            } else {
                data = await res.json();
            }
        }

        if (data.success) {
            // Update state with logged in user
            state.user.name = data.user.name;
            state.user.email = data.user.email;
            state.user.role = data.user.role || 'faculty';
            
            // Extract first letters for avatar (e.g. "Dr. Sunil Yadav" -> "SY")
            const parts = data.user.name.split(" ");
            const avatarLetters = parts.length > 2 ? parts[1][0] + parts[2][0] : parts[0][0] + (parts[1] ? parts[1][0] : "");
            state.user.avatar = avatarLetters.toUpperCase();

            viewLogin.classList.remove("active");
            viewApp.classList.remove("hidden");
            viewApp.classList.add("active");
            state.isLoggedIn = true;

            const nameParts = state.user.name.split(" ");
            const welcomeTitle = nameParts.length > 2 ? `${nameParts[1]} ${nameParts[2]}` : state.user.name;
            welcomeName.textContent = `Welcome, ${welcomeTitle}`;
            
            // Update the Top Header Avatar
            const headerAvatar = document.querySelector(".user-profile .avatar");
            if (headerAvatar) headerAvatar.textContent = state.user.avatar;

            // Update the Settings Profile Page Dynamically!
            const profileName = document.getElementById("profile-name");
            const profileEmail = document.getElementById("profile-email");
            const profileAvatar = document.querySelector(".profile-avatar-large");
            const profileRole = document.getElementById("profile-role");
            
            if (profileName) profileName.textContent = state.user.name;
            if (profileEmail) profileEmail.textContent = state.user.email;
            if (profileAvatar) profileAvatar.textContent = state.user.avatar;
            if (profileRole) {
                if (state.user.role === 'admin' || state.user.email.toLowerCase() === 'swapnali.makdey@fragnel.edu') {
                    profileRole.textContent = "Head of Department";
                } else {
                    profileRole.textContent = "Faculty";
                }
            }
            
            // Show loading state first
            document.getElementById("stat-total").textContent = "...";
            document.getElementById("stat-available").textContent = "...";
            document.getElementById("stat-occupied").textContent = "...";
            document.getElementById("stat-my-bookings").textContent = "...";
            document.getElementById("recent-bookings-list").innerHTML = "<div class='text-muted' style='padding: 1rem;'>Loading data...</div>";

            // Fetch data
            const [isBookingOnline, isAbsenceOnline] = await Promise.all([
                fetchBookings(),
                fetchAbsences(),
                fetchDisabledRooms()
            ]);
            
            refreshAllViews();
            
            if (isBookingOnline || isAbsenceOnline) {
                showToast("Successfully signed in.");
            } else {
                showToast("Offline Mode: Using local fallback storage.");
            }
        } else {
            showToast("Invalid email or password.", "error"); // UX addition
        }
    } catch (err) {
        console.error("Login failed:", err);
        showToast("Cannot connect to server. Ensure backend is running.", "error");
    }
});

btnSignout.addEventListener("click", () => {
    viewApp.classList.remove("active");
    viewApp.classList.add("hidden");
    viewLogin.classList.add("active");
    state.isLoggedIn = false;
    
    const chatWindow = document.getElementById("chat-window");
    if (chatWindow) chatWindow.classList.add("hidden");
});

// Routing
sidebarLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active class from all links
        sidebarLinks.forEach(l => l.classList.remove("active"));
        // Add active to clicked
        link.classList.add("active");

        // Hide all pages
        pageViews.forEach(page => {
            page.classList.remove("active");
            page.classList.add("hidden");
        });

        // Show target page
        const targetId = `view-${link.dataset.target}`;
        state.currentPage = link.dataset.target;
        document.getElementById(targetId).classList.remove("hidden");
        document.getElementById(targetId).classList.add("active");

        // Refresh specific view if needed
        if (targetId === "view-dashboard") refreshAllViews();
    });
});


// --- 3. RENDER FUNCTIONS ---

function refreshAllViews() {
    renderDashboard();
    renderRooms();
    renderMyBookings();
}

function renderDashboard() {
    // Calculate stats
    const totalRooms = state.rooms.length;

    let occupied = 0;
    state.rooms.forEach(room => {
        if (isRoomOccupiedNow(room.id)) {
            occupied++;
        }
    });

    const available = totalRooms - occupied;
    const myBookingsCount = state.bookings.filter(b => areFacultyNamesEqual(b.faculty, state.user.name)).length;

    document.getElementById("stat-total").textContent = totalRooms;
    document.getElementById("stat-available").textContent = available;
    document.getElementById("stat-occupied").textContent = occupied;
    document.getElementById("stat-my-bookings").textContent = myBookingsCount;

    // Quick Stats
    document.getElementById("qs-classrooms").textContent = state.rooms.filter(r => !r.isLab).length;
    document.getElementById("qs-labs").textContent = state.rooms.filter(r => r.isLab).length;
    document.getElementById("qs-weekly-bookings").textContent = state.bookings.length;

    // Recent Bookings List
    const recentList = document.getElementById("recent-bookings-list");
    recentList.innerHTML = "";

    // Render last 5
    const displayBookings = [...state.bookings].reverse().slice(0, 5);
    displayBookings.forEach(booking => {
        const item = document.createElement("div");
        item.className = "recent-item";
        item.innerHTML = `
            <div class="recent-item-info">
                <strong>Room ${booking.room} – ${booking.faculty}</strong>
                <span>${booking.day} – ${booking.time}</span>
            </div>
            <div class="badge badge-green">Confirmed</div>
        `;
        recentList.appendChild(item);
    });
}

function renderRooms() {
    const grid = document.getElementById("rooms-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const filteredRooms = state.rooms.filter(room => {
        if (state.currentRoomFilter === "Classroom") return !room.isLab;
        if (state.currentRoomFilter === "Lab") return room.isLab;
        return true;
    });

    const isAdmin = state.user && state.user.role === 'admin';

    filteredRooms.forEach(room => {
        const isOccupied = isRoomOccupiedNow(room.id);
        const icon = room.isLab ? "ph-desktop" : "ph-chalkboard-teacher";
        const isDisabled = disabledRooms.includes(room.id);

        const accentColor = room.isLab ? "linear-gradient(90deg, #c084fc, #e879f9)" : "linear-gradient(90deg, #60a5fa, #3b82f6)";
        
        let statusBadge = `<div class="badge ${isOccupied ? 'badge-orange' : 'badge-green'}">${isOccupied ? 'Occupied Now' : 'Available Now'}</div>`;
        if (isDisabled) {
            statusBadge = `<div class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid #ef4444; font-size: 0.75rem;">Unavailable (Under Work)</div>`;
        }

        let adminButton = "";
        if (isAdmin) {
            adminButton = `
                <button class="btn btn-secondary btn-toggle-disable w-full" style="margin-top: 0.5rem; background: ${isDisabled ? '#10b981' : '#ef4444'}; color: #fff;" data-room="${room.id}">
                    ${isDisabled ? 'Enable' : 'Disable'} Room
                </button>
            `;
        }

        const cardHtml = `
            <div class="room-card" style="opacity: ${isDisabled ? '0.75' : '1'};">
                <div class="room-card-accent" style="background: ${accentColor};"></div>
                <div class="room-card-content">
                    <div class="room-card-header">
                        <div class="icon-circle"><i class="ph ${icon}"></i></div>
                        ${statusBadge}
                    </div>
                    <div class="room-details">
                        <h4>Room ${room.id}</h4>
                        <p>${room.type}</p>
                        <p>${room.floor} – ${room.dept}</p>
                    </div>
                    <div class="room-card-footer">
                        <button class="btn btn-primary w-full btn-view-schedule" ${isDisabled && !isAdmin ? 'disabled' : ''} data-room="${room.id}">
                            ${isDisabled && !isAdmin ? 'Room Disabled' : 'View Schedule'}
                        </button>
                        ${adminButton}
                    </div>
                </div>
            </div>
        `;

        grid.insertAdjacentHTML("beforeend", cardHtml);
    });

    // Attach event listeners to all purely native buttons
    document.querySelectorAll(".btn-view-schedule").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const roomId = e.target.closest("button").dataset.room;
            openScheduleModal(roomId);
        });
    });

    document.querySelectorAll(".btn-toggle-disable").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const roomId = e.target.closest("button").dataset.room;
            const isDisabled = disabledRooms.includes(roomId);
            const endpoint = isDisabled ? "enable-room" : "disable-room";
            
            // Client side update immediately!
            if (isDisabled) {
                disabledRooms = disabledRooms.filter(r => r !== roomId);
            } else {
                disabledRooms.push(roomId);
            }
            localStorage.setItem("bookspace_disabled_rooms", JSON.stringify(disabledRooms));
            showToast(`Room ${roomId} successfully ${isDisabled ? 'enabled' : 'disabled'}!`);
            renderRooms();

            try {
                const res = await fetch(`${API_BASE}/${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ room: roomId })
                });
                const data = await res.json();
                if (data.success) {
                    disabledRooms = data.disabledRooms;
                    localStorage.setItem("bookspace_disabled_rooms", JSON.stringify(disabledRooms));
                    renderRooms();
                }
            } catch (err) {
                console.error("Backend fetch error for disable room:", err);
            }
        });
    });
}

function renderMyBookings() {
    const tbody = document.getElementById("my-bookings-tbody");
    tbody.innerHTML = "";

    const myBookings = state.bookings.filter(b => areFacultyNamesEqual(b.faculty, state.user.name));

    myBookings.forEach(booking => {
        const roomObj = state.rooms.find(r => r.id === booking.room);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>Room ${booking.room}</strong></td>
            <td>${roomObj.type}</td>
            <td>${booking.day}</td>
            <td>${booking.time}</td>
            <td><span class="badge badge-green">Confirmed</span></td>
            <td>
                <button class="btn btn-ghost text-orange btn-cancel-booking" data-id="${booking.id}">
                    Cancel
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Listeners for cancel
    document.querySelectorAll(".btn-cancel-booking").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const bookingId = e.target.closest("button").dataset.id;
            cancelBooking(bookingId);
        });
    });
}


// --- 4. MODALS & SCHEDULING ---

function openScheduleModal(roomId) {
    const room = state.rooms.find(r => r.id === roomId);
    document.getElementById("schedule-modal-title").textContent = `Room ${room.id} – Weekly Schedule`;
    document.getElementById("schedule-modal-subtitle").textContent = `${room.type} • ${room.floor} • ${room.dept}`;

    const tbody = document.getElementById("schedule-tbody");
    tbody.innerHTML = "";

    // Generate Row for each Time Slot
    state.timeSlots.forEach(slot => {
        const tr = document.createElement("tr");

        if (slot.isBreak) {
            tr.className = "break-row";
            tr.innerHTML = `
                <td>${slot.time}</td>
                <td colspan="5">${slot.label}</td>
            `;
        } else {
            // Normal Row
            let rowHtml = `<td><strong>${slot.time}</strong></td>`;

            // Generate columns for Monday-Friday
            state.days.forEach(day => {
                const slotStatus = getSlotStatus(roomId, day, slot.time);

                const isDisabled = disabledRooms.includes(roomId);
                const isAdmin = state.user && state.user.role === 'admin';

                if (isDisabled && !isAdmin) {
                    rowHtml += `
                        <td style="text-align: center;">
                            <div class="badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); font-size: 0.75rem;">Disabled</div>
                        </td>
                    `;
                } else if (slotStatus.status === 'TIMETABLE') {
                    rowHtml += `
                        <td style="background: var(--timetable-bg);">
                            <div class="badge badge-blue" style="margin-bottom:4px; display:block; width:fit-content; margin:0 auto">Timetable</div>
                            <strong style="display:block; text-align:center; font-size:0.75rem;">${slotStatus.details.subject}</strong>
                            <span class="text-xs text-muted" style="display:block; text-align:center">${slotStatus.details.faculty}</span>
                        </td>
                    `;
                } else if (slotStatus.status === 'BOOKED') {
                    rowHtml += `
                        <td style="background: var(--booking-bg, #fef08a);">
                            <div class="badge badge-orange" style="margin-bottom:4px; display:block; width:fit-content; margin:0 auto">Booked</div>
                            <span class="text-xs text-muted" style="display:block; text-align:center">${slotStatus.details.faculty}</span>
                        </td>
                    `;
                } else {
                    rowHtml += `
                        <td>
                            <button class="btn btn-success text-xs btn-book-slot" 
                                data-room="${roomId}" 
                                data-day="${day}" 
                                data-time="${slot.time}">
                                Book
                            </button>
                        </td>
                    `;
                }
            });

            tr.innerHTML = rowHtml;
        }
        tbody.appendChild(tr);
    });

    // Attach listeners for "Book" buttons
    document.querySelectorAll(".btn-book-slot").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const b = e.target.closest("button");
            openConfirmModal(b.dataset.room, b.dataset.day, b.dataset.time);
        });
    });

    modalSchedule.classList.remove("hidden");
}

function openConfirmModal(roomId, day, time) {
    state.tempBookingData = { room: roomId, day, time, faculty: state.user.name };

    document.getElementById("confirm-room").textContent = roomId;
    document.getElementById("confirm-faculty").textContent = state.user.name;
    document.getElementById("confirm-day").textContent = day;
    document.getElementById("confirm-time").textContent = time;

    modalConfirm.classList.remove("hidden");
}

async function confirmBooking() {
    if (!state.tempBookingData) return;

    const newBooking = { ...state.tempBookingData };

    const savedBooking = await apiAddBooking(newBooking);
    
    if (savedBooking) {
        state.bookings.push(savedBooking);
        showToast(`Successfully booked Room ${newBooking.room} for ${newBooking.day}`);
    } else {
        newBooking.id = "b" + Date.now().toString(); // Fallback ID
        state.bookings.push(newBooking);
        localStorage.setItem("bookspace_bookings", JSON.stringify(state.bookings));
        showToast(`Offline Mode: Locally booked Room ${newBooking.room} for ${newBooking.day}`);
    }

    // Send Actual Email Reminder using Nodemailer immediately
    setTimeout(async () => {
        try {
            const res = await fetch(`${API_BASE}/send-reminder`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toEmail: state.user.email,
                    subject: `Booking Confirmed: Room ${newBooking.room}`,
                    body: `Hello ${state.user.name},\n\nYour booking is confirmed.\n\nYou have successfully booked Room ${newBooking.room} for ${newBooking.day} at ${newBooking.time}.\n\nBest,\nBookSpace Assistant`
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast(`Confirmation Email sent to ${state.user.email}!`);
            }
        } catch (e) {
            console.error("Failed to send email", e);
        }
    }, 1000);

    // Update Views
    modalConfirm.classList.add("hidden");

    // Re-render schedule if still open
    if (!modalSchedule.classList.contains("hidden")) {
        openScheduleModal(newBooking.room);
    }

    refreshAllViews();
}

async function cancelBooking(bookingId) {
    const isOnline = await apiDeleteBooking(bookingId);

    // Remove locally
    state.bookings = state.bookings.filter(b => b.id !== bookingId);

    if (!isOnline) {
        localStorage.setItem("bookspace_bookings", JSON.stringify(state.bookings));
    } else {
        await fetchBookings();
    }

    refreshAllViews();
    showToast("Booking cancelled successfully.");
}

// Modal closing
btnCloseModals.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.target.closest(".modal-overlay").classList.add("hidden");
    });
});

document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.classList.add("hidden");
        }
    });
});

btnCancelConfirm.addEventListener("click", () => {
    modalConfirm.classList.add("hidden");
});

btnSubmitConfirm.addEventListener("click", confirmBooking);


// --- 5. UTILS ---

function showToast(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize on Load (wait for DOM)
document.addEventListener("DOMContentLoaded", () => {
    
    // Rooms Filter Setup
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".filter-btn").forEach(b => {
                b.style.background = "transparent";
                b.style.boxShadow = "none";
                b.style.color = "var(--text-muted)";
            });
            e.target.style.background = "var(--bg-white)";
            e.target.style.boxShadow = "var(--shadow-sm)";
            e.target.style.color = "var(--text-main)";
            
            state.currentRoomFilter = e.target.dataset.filter;
            renderRooms();
        });
    });

    // Reminder setting removed as per user request

    // Theme Toggle Setup
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.checked = localStorage.getItem("bookspace_theme") === "dark";
        themeToggle.addEventListener("change", (e) => {
            const isDark = e.target.checked;
            if (isDark) {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("bookspace_theme", "dark");
            } else {
                document.documentElement.removeAttribute("data-theme");
                localStorage.setItem("bookspace_theme", "light");
            }
        });
    }

    // Absence Management Setup
    const btnMarkAbsent = document.getElementById("btn-mark-absent");
    if (btnMarkAbsent) {
        btnMarkAbsent.addEventListener("click", async () => {
            const day = document.getElementById("absence-day").value;
            const existingAbsence = state.absences.find(a => areFacultyNamesEqual(a.faculty, state.user.name) && a.day === day);
            if (existingAbsence) {
                showToast(`You are already marked absent for ${day}.`);
                return;
            }
            
            // Remove existing bookings for this day
            const bookingsToRemove = state.bookings.filter(b => areFacultyNamesEqual(b.faculty, state.user.name) && b.day === day);
            for (const b of bookingsToRemove) {
                await apiDeleteBooking(b.id);
            }
            state.bookings = state.bookings.filter(b => !(areFacultyNamesEqual(b.faculty, state.user.name) && b.day === day));
            localStorage.setItem("bookspace_bookings", JSON.stringify(state.bookings));

            const newAbsence = { id: Date.now().toString(), faculty: state.user.name, day };
            const savedAbsence = await apiAddAbsence(newAbsence);
            
            if (savedAbsence) {
                state.absences.push(savedAbsence);
                showToast(`Marked absent for ${day}. Existing bookings cleared.`);
            } else {
                state.absences.push(newAbsence);
                showToast(`Offline Mode: Marked absent for ${day}. Bookings cleared.`);
            }
            
            renderAbsences();
            refreshAllViews();
        });
    }
    renderAbsences();
});

function renderAbsences() {
    const list = document.getElementById("absence-list");
    if (!list) return;
    list.innerHTML = "";
    const myAbsences = state.absences.filter(a => areFacultyNamesEqual(a.faculty, state.user.name));
    
    if (myAbsences.length === 0) {
        list.innerHTML = "<li>No absences marked.</li>";
        return;
    }

    myAbsences.forEach(a => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "0.5rem";
        li.innerHTML = `
            <span>${a.day}</span>
            <button class="btn btn-ghost text-orange text-xs btn-remove-absence" data-id="${a.id}" style="padding: 0.25rem 0.5rem;">Remove</button>
        `;
        list.appendChild(li);
    });

    document.querySelectorAll(".btn-remove-absence").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            const success = await apiDeleteAbsence(id);
            
            state.absences = state.absences.filter(a => a.id !== id);
            renderAbsences();
            refreshAllViews();
            showToast(success ? "Absence removed." : "Offline Mode: Absence removed.");
        });
    });
}

// --- 4. THEME TOGGLES & SETTINGS ---
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.checked = document.documentElement.getAttribute("data-theme") === "dark";
        themeToggle.addEventListener("change", (e) => {
            if (e.target.checked) {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("bookspace_theme", "dark");
            } else {
                document.documentElement.removeAttribute("data-theme");
                localStorage.setItem("bookspace_theme", "light");
            }
        });
    }
});

// --- 5. AI CHATBOT INTEGRATION ---
document.addEventListener("DOMContentLoaded", () => {
    const chatBtn = document.getElementById("floating-chat-btn");
    const chatWindow = document.getElementById("chat-window");
    const closeChatBtn = document.getElementById("close-chat-btn");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    let chatHistory = [];

    if (!chatBtn) return;

    chatBtn.addEventListener("click", () => {
        chatWindow.classList.toggle("hidden");
        if (!chatWindow.classList.contains("hidden")) chatInput.focus();
    });

    closeChatBtn.addEventListener("click", () => {
        chatWindow.classList.add("hidden");
    });

    // Helper: append a message to chat window
    function appendMessage(sender, text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `chat-message ${sender}`;
        msgDiv.innerHTML = `<div class="msg-content">${text}</div>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Helper: show/hide typing indicator
    function toggleTypingIndicator(show) {
        if (show) {
            const typingDiv = document.createElement("div");
            typingDiv.className = "chat-message bot typing-indicator-msg";
            typingDiv.innerHTML = `<div class="msg-content typing-dots"><span></span><span></span><span></span></div>`;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            const typingIndicator = chatMessages.querySelector(".typing-indicator-msg");
            if (typingIndicator) typingIndicator.remove();
        }
    }

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userInput = chatInput.value.trim();
        if (!userInput) return;

        // Display user message
        appendMessage("user", userInput);
        chatInput.value = "";
        
        chatHistory.push({ role: "user", content: userInput });
        
        toggleTypingIndicator(true);

        // Prep context payload for backend
        const userContext = {
            name: state.user.name,
            timetable: timetable,
            bookings: state.bookings,
            absences: state.absences,
            rooms: state.rooms,
            isLoggedIn: state.isLoggedIn,
            currentPage: state.currentPage
        };

        try {
            const res = await fetch(`${API_BASE}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: chatHistory,
                    userContext: userContext
                })
            });
            
            const data = await res.json();
            toggleTypingIndicator(false);
            
            if (data.reply) {
                appendMessage("bot", data.reply.content);
                chatHistory.push({ role: "assistant", content: data.reply.content });
                
                if (data.clientActions && data.clientActions.length > 0) {
                    data.clientActions.forEach(actionObj => {
                        const { action, data } = actionObj;
                        if (action === 'bookSlot') {
                            openConfirmModal(data.room, data.day, data.time);
                        } else if (action === 'cancelBooking') {
                            cancelBooking(data.id);
                        } else if (action === 'navigateTo') {
                            const targetLink = Array.from(sidebarLinks).find(l => l.dataset.target === data.page);
                            if (targetLink) targetLink.click();
                        } else if (action === 'filterRooms') {
                            const targetLink = Array.from(sidebarLinks).find(l => l.dataset.target === 'rooms');
                            if (targetLink) targetLink.click();
                            const targetBtn = Array.from(document.querySelectorAll(".filter-btn")).find(b => b.dataset.filter === data.type);
                            if (targetBtn) targetBtn.click();
                        } else if (action === 'openSchedule') {
                            openScheduleModal(data.roomId);
                        }
                    });
                }
                
                // If bot mutated DB, refresh UI seamlessly!
                if (data.hasMutation) {
                    await fetchBookings();
                    refreshAllViews();
                }
            } else {
                appendMessage("bot", "Sorry, I am having trouble connecting to my brain.");
            }
        } catch (err) {
            console.error("Chat error:", err);
            toggleTypingIndicator(false);
            appendMessage("bot", "Network error. Make sure the Node.js backend is running.");
        }
    });
});
