// SPA state
const appState = {
    user: null, // { email }
    bookings: [],
    selectedTrip: null,
    selectedSeats: [],
    trips: [],
    renderedTrips: [], // Store trips that are currently displayed
};

// Mock data: Companies
const BUS_COMPANIES = [
    "Nile Star Buses",
    "Gateway Bus Service",
    "YnY Coaches",
    "Trinity Bus",
    "Jaguar Executive Coaches",
    "KK Coaches",
    "Mash Poa Buses",
];

function generatePrice() {
    const min = 100000;
    const max = 150000;
    const step = 5000;
    const steps = Math.floor((max - min) / step);
    return min + Math.floor(Math.random() * (steps + 1)) * step;
}

// Mock data: Uganda districts (major list) + EA countries
// Note: This list covers all districts as of recent updates and popular alternates.
const UGANDA_DISTRICTS = [
    "Abim","Adjumani","Agago","Alebtong","Amolatar","Amudat","Amuria","Amuru","Apac","Arua City","Arua","Budaka","Bududa","Bugiri","Buhweju","Buikwe","Bukedea","Bukomansimbi","Bukwa","Bulambuli","Buliisa","Bundibugyo","Bunyangabu","Bushenyi","Busia","Butaleja","Butambala","Butebo","Buvuma","Buyende","Dokolo","Gomba","Gulu City","Gulu","Hoima City","Hoima","Ibanda","Iganga","Isingiro","Jinja City","Jinja","Kaabong","Kabale","Kabarole","Kaberamaido","Kagadi","Kakumiro","Kalangala","Kaliro","Kalungu","Kampala","Kamuli","Kamwenge","Kanungu","Kapchorwa","Kapelebyong","Kasese","Katakwi","Kayunga","Kazo","Kibaale","Kiboga","Kibuku","Kikuube","Kiruhura","Kiryandongo","Kisoro","Kitagwenda","Kitgum","Koboko","Kole","Kotido","Kumi","Kwania","Kween","Kyankwanzi","Kyegegwa","Kyenjojo","Kyotera","Lamwo","Lira City","Lira","Luuka","Luwero","Lwengo","Lyantonde","Manafwa","Maracha","Masaka City","Masaka","Masindi","Mayuge","Mbale City","Mbale","Mbarara City","Mbarara","Mitooma","Mityana","Moroto","Moyo","Mpigi","Mubende","Mukono","Nabilatuk","Nakapiripirit","Nakaseke","Nakasongola","Namayingo","Namisindwa","Namutumba","Napak","Nebbi","Ngora","Ntoroko","Ntungamo","Nwoya","Omoro","Otuke","Oyam","Pader","Pakwach","Pallisa","Rakai","Rubanda","Rubirizi","Rukiga","Rukungiri","Sembabule","Serere","Sheema","Sironko","Soroti City","Soroti","Tororo","Wakiso","Yumbe","Zombo"
];

const EAST_COUNTRIES = [
    "Kenya",
    "Rwanda",
    "Tanzania",
    "Somalia",
    "South Sudan",
    "DRC",
    "Burundi",
    "Ethiopia",
];

const ALL_DESTINATIONS = [...UGANDA_DISTRICTS, ...EAST_COUNTRIES];

// Generate mock trips
function generateMockTrips() {
    const today = new Date();
    const sampleTimes = ["06:00", "08:30", "12:00", "15:30", "20:00", "22:00"];
    const trips = [];
    for (let i = 0; i < 80; i++) {
        const company = BUS_COMPANIES[i % BUS_COMPANIES.length];
        const to = ALL_DESTINATIONS[(i * 7) % ALL_DESTINATIONS.length];
        const date = new Date(today);
        date.setDate(today.getDate() + (i % 10));
        const dateStr = date.toISOString().slice(0, 10);
        const time = sampleTimes[i % sampleTimes.length];
        const price = generatePrice();
        const seats = Array.from({ length: 45 }, (_, idx) => ({
            seatNo: idx + 1,
            booked: Math.random() < 0.18,
        }));
        trips.push({ id: `T${i + 1}`, company, from: "Kampala", to, date: dateStr, time, price, seats });
    }
    return trips;
}

function generateFeaturedTripsToday() {
    const todayStr = new Date().toISOString().slice(0, 10);
    const popularTo = [
        "Jinja","Mbarara","Gulu","Entebbe","Arua","Fort Portal","Mbale",
    ];
    return BUS_COMPANIES.map((company, i) => {
        const to = popularTo[i % popularTo.length];
        const time = ["06:30","09:00","12:30","15:00","18:30","20:30","22:00"][i % 7];
        const price = generatePrice();
        const seats = Array.from({ length: 45 }, (_, idx) => ({ seatNo: idx + 1, booked: Math.random() < 0.12 }));
        return { id: `F${i+1}`, company, from: "Kampala", to, date: todayStr, time, price, seats };
    });
}

function generateRandomTripsForDate(dateStr, count) {
    const trips = [];
    const usedCompanies = new Set();
    const times = ["06:00","08:00","12:00","15:00","18:00","20:00","22:00"];
    while (trips.length < count && usedCompanies.size < BUS_COMPANIES.length) {
        const company = BUS_COMPANIES[Math.floor(Math.random() * BUS_COMPANIES.length)];
        if (usedCompanies.has(company)) continue;
        usedCompanies.add(company);
        const to = ALL_DESTINATIONS[Math.floor(Math.random() * ALL_DESTINATIONS.length)];
        const time = times[Math.floor(Math.random() * times.length)];
        const price = generatePrice();
        const seats = Array.from({ length: 45 }, (_, idx) => ({ seatNo: idx + 1, booked: Math.random() < 0.15 }));
        trips.push({ id: `R${dateStr.replace(/-/g, '')}_${trips.length+1}`, company, from: "Kampala", to, date: dateStr, time, price, seats });
    }
    return trips;
}

function generateCompanyTripsForDestination(dateStr, destination) {
    const date = dateStr || new Date().toISOString().slice(0, 10);
    return BUS_COMPANIES.map((company, i) => {
        const times = ["06:00","08:30","12:00","15:30","18:00","20:00","22:00"];
        const time = times[i % times.length];
        const price = generatePrice();
        const seats = Array.from({ length: 45 }, (_, idx) => ({ seatNo: idx + 1, booked: Math.random() < 0.15 }));
        return { id: `C${date.replace(/-/g, '')}_${i+1}`, company, from: "Kampala", to: destination, date, time, price, seats };
    });
}

function isNoServiceDay(dateStr, destination) {
    if (!dateStr || !destination) return false;
    const key = `${destination}|${dateStr}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    // About 1 in 5 combinations show no service to simulate off-days
    return hash % 5 === 0;
}

function setHidden(id, hidden) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`Element with id "${id}" not found`);
        return;
    }
    if (hidden) {
        el.classList.add("hidden");
        el.style.display = "none";
    } else {
        el.classList.remove("hidden");
        el.style.display = "";
    }
}

function populateDestinations() {
    const toSelect = document.getElementById("to");
    const adminTo = document.getElementById("adminTo");
    if (!toSelect) return;
    const makeOptions = (select) => {
        select.innerHTML = '<option value="">Select Destination</option>';
        const ogUg = document.createElement('optgroup');
        ogUg.label = 'Around Uganda';
        UGANDA_DISTRICTS.forEach((d) => {
            const opt = document.createElement('option');
            opt.value = d;
            opt.textContent = d;
            ogUg.appendChild(opt);
        });
        const ogEa = document.createElement('optgroup');
        ogEa.label = 'East African Countries';
        EAST_COUNTRIES.forEach((c) => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            ogEa.appendChild(opt);
        });
        select.appendChild(ogUg);
        select.appendChild(ogEa);
    };
    makeOptions(toSelect);
    if (adminTo) makeOptions(adminTo);
}

function renderResults(trips) {
    const section = document.getElementById("search-results");
    const container = document.getElementById("resultsContainer");
    container.innerHTML = "";
    
    // Store the trips that are being rendered so we can find them later
    appState.renderedTrips = trips;
    
    if (!trips.length) {
        container.innerHTML = '<div class="col-span-2 text-center text-gray-600">No buses found for your criteria.</div>';
        setHidden("search-results", false);
        return;
    }
    
    trips.forEach((trip) => {
        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:items-center justify-between";
        
        // Build URL for seat selection page
        const seatParams = new URLSearchParams({
            from: trip.from,
            to: trip.to,
            date: trip.date,
            busId: trip.id
        });
        
        card.innerHTML = `
            <div class="mb-4 md:mb-0">
                <div class="text-lg font-bold">${trip.company}</div>
                <div class="text-gray-600">${trip.from} → ${trip.to}</div>
                <div class="text-gray-600">${trip.date} • ${trip.time}</div>
            </div>
            <div class="flex items-center space-x-6">
                <div class="text-primary text-xl font-bold">UGX ${trip.price.toLocaleString()}</div>
                <a href="seats.html?${seatParams.toString()}" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-block">Select Seats</a>
            </div>
        `;
        container.appendChild(card);
    });
    setHidden("search-results", false);
    attachSeatButtons();
}

// Store the handler function reference for proper cleanup
let seatButtonClickHandler = null;

function attachSeatButtons() {
    // Use event delegation on the results container to handle clicks
    const container = document.getElementById("resultsContainer");
    if (!container) return;
    
    // Remove existing listener if any
    if (seatButtonClickHandler) {
        container.removeEventListener("click", seatButtonClickHandler);
    }
    
    // Create new handler
    seatButtonClickHandler = function(e) {
        // Check if clicked element or its parent has the selectSeatsBtn class
        const btn = e.target.closest(".selectSeatsBtn");
        if (!btn) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const id = btn.getAttribute("data-trip");
        if (!id) {
            console.error("No trip ID found");
            alert("Error: Trip ID not found. Please try again.");
            return;
        }
        
        // First try to find in rendered trips, then in appState.trips
        let trip = appState.renderedTrips.find((t) => t.id === id);
        if (!trip) {
            trip = appState.trips.find((t) => t.id === id);
        }
        if (!trip) {
            console.error("Trip not found:", id);
            console.error("Rendered trips:", appState.renderedTrips.map(t => t.id));
            console.error("All trips:", appState.trips.map(t => t.id));
            alert("Error: Trip not found. Please search again.");
            return;
        }
        
        console.log("Opening seat modal for trip:", trip);
        appState.selectedTrip = trip;
        appState.selectedSeats = [];
        openSeatModal(trip);
    };
    
    // Add new listener
    container.addEventListener("click", seatButtonClickHandler);
}

// Enhanced seat selection with hover preview
function openSeatModal(trip) {
    if (!trip) {
        console.error("No trip provided to openSeatModal");
        alert("Error: No trip information available. Please try again.");
        return;
    }
    
    const modal = document.getElementById("seatModal");
    const container = document.getElementById("seatContainer");
    const tripInfo = document.getElementById("seatModalTripInfo");
    
    if (!modal) {
        console.error("Seat modal element not found");
        alert("Error: Seat selection modal not found. Please refresh the page.");
        return;
    }
    
    if (!container) {
        console.error("Seat container element not found");
        alert("Error: Seat container not found. Please refresh the page.");
        return;
    }
    
    container.innerHTML = "";
    appState.selectedSeats = [];
    updateSelectedSeatsSummary();
    
    if (tripInfo) {
        tripInfo.textContent = `${trip.company} • ${trip.from} → ${trip.to} • ${trip.date} ${trip.time}`;
    }
    
    trip.seats.forEach((s) => {
        const seat = document.createElement("button");
        seat.type = "button";
        seat.textContent = s.seatNo;
        seat.dataset.seatNo = s.seatNo;
        
        const baseClasses = "w-12 h-12 rounded text-sm font-semibold border-2 transition-all duration-200";
        if (s.booked) {
            seat.className = `${baseClasses} bg-red-500 text-white border-red-600 cursor-not-allowed opacity-75`;
            seat.title = `Seat ${s.seatNo} - Taken`;
        } else {
            seat.className = `${baseClasses} bg-green-500 text-white border-green-600 hover:bg-green-600 hover:scale-105`;
            seat.title = `Seat ${s.seatNo} - Available`;
            
            seat.addEventListener("click", () => toggleSeatSelection(s.seatNo, seat));
            seat.addEventListener("mouseenter", () => {
                if (!appState.selectedSeats.includes(s.seatNo)) {
                    seat.classList.add("bg-blue-400", "border-blue-500");
                }
            });
            seat.addEventListener("mouseleave", () => {
                if (!appState.selectedSeats.includes(s.seatNo)) {
                    seat.classList.remove("bg-blue-400", "border-blue-500");
                }
            });
        }
        container.appendChild(seat);
    });
    
    // Setup modal controls after modal content is ready
    handleSeatModalControls();
    
    // Remove hidden class and ensure flex display
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    
    // Force a reflow to ensure modal is visible
    modal.offsetHeight;
    
    console.log("Seat modal opened for trip:", trip.id);
    console.log("Selected seats count:", appState.selectedSeats.length);
}

// Track if we're already set to proceed (to avoid multiple timeouts)
let proceedTimeout = null;

function toggleSeatSelection(seatNo, el) {
    const idx = appState.selectedSeats.indexOf(seatNo);
    if (idx >= 0) {
        // Deselect seat - cancel auto-proceed if it was scheduled
        appState.selectedSeats.splice(idx, 1);
        el.classList.remove("bg-yellow-400", "border-yellow-500");
        el.classList.add("bg-green-500", "border-green-600");
        
        // Cancel auto-proceed if no seats selected
        if (proceedTimeout && appState.selectedSeats.length === 0) {
            clearTimeout(proceedTimeout);
            proceedTimeout = null;
        }
    } else {
        // Select seat - automatically save and proceed after short delay
        appState.selectedSeats.push(seatNo);
        el.classList.remove("bg-green-500", "border-green-600", "bg-blue-400", "border-blue-500");
        el.classList.add("bg-yellow-400", "border-yellow-500");
        
        appState.selectedSeats.sort((a, b) => a - b);
        
        // Clear any existing timeout
        if (proceedTimeout) {
            clearTimeout(proceedTimeout);
        }
        
        // Auto-proceed after 1 second (allows time to select multiple seats if needed)
        proceedTimeout = setTimeout(() => {
            if (appState.selectedSeats.length > 0 && appState.selectedTrip) {
                console.log("Auto-proceeding to booking summary with seats:", appState.selectedSeats);
                proceedTimeout = null;
                closeSeatModal();
                goToBookingSummary();
            }
        }, 1000);
    }
    updateSelectedSeatsSummary();
}

function updateSelectedSeatsSummary() {
    const summary = document.getElementById("selectedSeatsSummary");
    const list = document.getElementById("selectedSeatsList");
    const count = document.getElementById("selectedSeatsCount");
    const total = document.getElementById("selectedSeatsTotal");
    
    if (!summary || !list || !count || !total) return;
    
    if (appState.selectedSeats.length > 0) {
        summary.classList.remove("hidden");
        list.innerHTML = appState.selectedSeats.map(s => 
            `<span class="bg-primary text-white px-3 py-1 rounded-full text-sm">Seat ${s}</span>`
        ).join("");
        count.textContent = appState.selectedSeats.length;
        
        const trip = appState.selectedTrip;
        if (trip) {
            const totalAmount = trip.price * appState.selectedSeats.length;
            total.textContent = `UGX ${totalAmount.toLocaleString()}`;
        }
    } else {
        summary.classList.add("hidden");
    }
}

function closeSeatModal() {
    // Cancel any pending auto-proceed
    if (proceedTimeout) {
        clearTimeout(proceedTimeout);
        proceedTimeout = null;
    }
    
    const modal = document.getElementById("seatModal");
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
    document.body.style.overflow = "";
}

function goToBookingSummary() {
    console.log("goToBookingSummary called");
    console.log("Selected seats:", appState.selectedSeats);
    console.log("Selected trip:", appState.selectedTrip);
    
    if (!appState.selectedSeats || !appState.selectedSeats.length) {
        alert("Please select at least one seat.");
        return;
    }
    
    if (!appState.selectedTrip) {
        alert("Error: No trip selected. Please try again.");
        return;
    }
    
    closeSeatModal();
    
    // Check if we're on booking.html, if not redirect
    const currentPage = window.location.pathname;
    const isBookingPage = currentPage.includes('booking.html') || currentPage.endsWith('booking.html');
    
    if (!isBookingPage) {
        // Store state in sessionStorage before redirecting
        sessionStorage.setItem('pendingBooking', JSON.stringify({
            trip: appState.selectedTrip,
            seats: appState.selectedSeats
        }));
        window.location.href = 'booking.html';
        return;
    }
    
    // If on booking page, show summary
    displayBookingSummary();
}

function displayBookingSummary() {
    const trip = appState.selectedTrip;
    if (!trip) {
        console.error("No trip selected for booking summary");
        alert("Error: No trip selected. Please select seats again.");
        return;
    }
    
    if (!appState.selectedSeats || appState.selectedSeats.length === 0) {
        console.error("No seats selected");
        alert("Error: No seats selected. Please select at least one seat.");
        return;
    }
    
    // Update summary fields
    const summaryCompany = document.getElementById("summaryCompany");
    const summaryRoute = document.getElementById("summaryRoute");
    const summaryDate = document.getElementById("summaryDate");
    const summaryTime = document.getElementById("summaryTime");
    const summarySeats = document.getElementById("summarySeats");
    const summaryTotal = document.getElementById("summaryTotal");
    const summarySeatPreview = document.getElementById("summarySeatPreview");
    
    if (!summaryCompany || !summaryRoute) {
        console.error("Booking summary elements not found. Are you on the booking page?");
        // If not on booking page, redirect to it
        if (window.location.pathname !== '/booking.html' && !window.location.pathname.includes('booking.html')) {
            window.location.href = 'booking.html';
            return;
        }
    }
    
    if (summaryCompany) summaryCompany.textContent = trip.company;
    if (summaryRoute) summaryRoute.textContent = `${trip.from} → ${trip.to}`;
    if (summaryDate) summaryDate.textContent = trip.date;
    if (summaryTime) summaryTime.textContent = trip.time;
    if (summarySeats) summarySeats.textContent = appState.selectedSeats.join(", ");
    
    const totalAmount = trip.price * appState.selectedSeats.length;
    if (summaryTotal) summaryTotal.textContent = `UGX ${totalAmount.toLocaleString()}`;
    
    // Show seat preview
    if (summarySeatPreview) {
        summarySeatPreview.innerHTML = "";
        trip.seats.forEach((s) => {
            const seatDiv = document.createElement("div");
            const isSelected = appState.selectedSeats.includes(s.seatNo);
            const className = isSelected 
                ? "w-10 h-10 rounded bg-yellow-400 border-2 border-yellow-500 text-xs flex items-center justify-center"
                : s.booked 
                ? "w-10 h-10 rounded bg-red-500 border-2 border-red-600 text-xs flex items-center justify-center opacity-50"
                : "w-10 h-10 rounded bg-green-500 border-2 border-green-600 text-xs flex items-center justify-center";
            seatDiv.className = className;
            seatDiv.textContent = s.seatNo;
            summarySeatPreview.appendChild(seatDiv);
        });
    }
    
    const bookingSummarySection = document.getElementById("bookingSummary");
    if (bookingSummarySection) {
        // Hide search results and show booking summary
        setHidden("search-results", true);
        setHidden("bookingSummary", false);
        
        console.log("Booking summary displayed");
        console.log("Trip:", trip);
        console.log("Seats:", appState.selectedSeats);
        
        // Scroll to summary after a short delay to ensure it's visible
        setTimeout(() => {
            bookingSummarySection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
    } else {
        console.error("Booking summary section not found");
        alert("Booking summary section not found. Please refresh the page.");
    }
}

function handleSearchSubmit() {
    const form = document.getElementById("searchForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const to = document.getElementById("to").value;
        const date = document.getElementById("date").value;
        let res;
        if (!to && !date) {
            // Show at least one trip per company
            res = generateFeaturedTripsToday();
        } else if (to) {
            // If a specific destination and date combination is an off-day, show no buses
            if (isNoServiceDay(date, to)) {
                res = [];
                renderResults(res);
                return;
            }
            // Ensure each company has at least one trip to the selected destination
            const base = appState.trips.filter((t) => t.to === to && (!date || t.date === date));
            const haveCompany = new Set(base.map((b) => b.company));
            const needed = BUS_COMPANIES.filter((c) => !haveCompany.has(c));
            const generated = generateCompanyTripsForDestination(date, to).filter((t) => needed.includes(t.company));
            res = base.concat(generated);
        } else {
            // Date selected without destination: use matching trips + 3 random for that date
            res = appState.trips.filter((t) => (!date || t.date === date));
            const extra = generateRandomTripsForDate(date, 3);
            res = res.concat(extra);
        }
        renderResults(res);
    });
}

// Use event delegation for modal controls to avoid cloning issues
let modalControlsHandler = null;

function handleSeatModalControls() {
    const modal = document.getElementById("seatModal");
    if (!modal) return;
    
    // Remove existing handler if any
    if (modalControlsHandler) {
        modal.removeEventListener("click", modalControlsHandler);
    }
    
    // Create new handler using event delegation
    modalControlsHandler = function(e) {
        // Handle close button (X)
        if (e.target.id === "closeSeatModal" || e.target.closest("#closeSeatModal")) {
            e.preventDefault();
            e.stopPropagation();
            closeSeatModal();
            return;
        }
        
        // Handle cancel button
        if (e.target.id === "closeSeatModalBtn" || e.target.closest("#closeSeatModalBtn")) {
            e.preventDefault();
            e.stopPropagation();
            closeSeatModal();
            return;
        }
        
        // Note: Confirm button removed - seats auto-proceed on selection
        
        // Handle clear seats button
        if (e.target.id === "clearSeatsBtn" || e.target.closest("#clearSeatsBtn")) {
            e.preventDefault();
            e.stopPropagation();
            
            // Cancel auto-proceed
            if (proceedTimeout) {
                clearTimeout(proceedTimeout);
                proceedTimeout = null;
            }
            
            appState.selectedSeats = [];
            const container = document.getElementById("seatContainer");
            if (container && appState.selectedTrip) {
                container.querySelectorAll("button").forEach(btn => {
                    const seatNo = parseInt(btn.dataset.seatNo);
                    if (seatNo && !appState.selectedTrip.seats.find(s => s.seatNo === seatNo)?.booked) {
                        btn.classList.remove("bg-yellow-400", "border-yellow-500");
                        btn.classList.add("bg-green-500", "border-green-600");
                    }
                });
            }
            updateSelectedSeatsSummary();
            return;
        }
        
        // Close modal when clicking outside (on the backdrop only, not on content)
        if (e.target.id === "seatModal" && e.target === e.currentTarget) {
            closeSeatModal();
            return;
        }
        
        // Prevent clicks inside modal content from closing
        if (e.target.closest('.bg-white')) {
            e.stopPropagation();
        }
    };
    
    // Add event listener to modal
    modal.addEventListener("click", modalControlsHandler);
}

function saveAndRenderBookings() {
    localStorage.setItem("ea_bookings", JSON.stringify(appState.bookings));
    renderBookings();
}

function renderBookings() {
    const container = document.getElementById("bookingsContainer");
    if (!container) return;
    container.innerHTML = "";
    const list = appState.bookings.filter((b) => !appState.user || b.userEmail === appState.user.email);
    if (!list.length) {
        container.innerHTML = '<div class="text-center text-gray-600">No bookings yet.</div>';
        return;
    }
    list.forEach((b) => {
        const d = document.createElement("div");
        d.className = "bg-white p-6 rounded-xl shadow";
        
        // Handle both old and new booking formats
        const paymentMethod = b.payment?.method || b.payment || "N/A";
        const passengerName = b.passenger?.fullName || b.fullName || "N/A";
        const totalAmount = b.totalAmount || (b.pricePerSeat * (b.seats?.length || 1));
        
        d.innerHTML = `
            <div class="font-bold mb-2">${b.company} • ${b.from} → ${b.to}</div>
            <div class="text-gray-600 mb-2">${b.date} • ${b.time}</div>
            <div class="text-gray-700 mb-1">Passenger: ${passengerName}</div>
            <div class="text-gray-700 mb-1">Seats: ${(b.seats || []).join(", ")}</div>
            <div class="text-gray-700 mb-1">Payment: ${paymentMethod}</div>
            <div class="text-primary font-bold mt-2">Total: UGX ${totalAmount.toLocaleString()}</div>
            <div class="text-xs text-gray-500 mt-2">Booking ID: ${b.id}</div>
        `;
        container.appendChild(d);
    });
}

// Store passenger data temporarily
let passengerData = null;

function handleBookingSummary() {
    const continueBtn = document.getElementById("continueToPassengerBtn");
    if (continueBtn) {
        continueBtn.addEventListener("click", () => {
            if (!appState.user) {
                openAuthModal("login");
                return;
            }
            setHidden("bookingSummary", true);
            displayPassengerForm();
        });
    }
}

function displayPassengerForm() {
    const seatsDisplay = document.getElementById("passengerSeatsDisplay");
    if (seatsDisplay) {
        seatsDisplay.innerHTML = appState.selectedSeats.map(s => 
            `<span class="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">Seat ${s}</span>`
        ).join("");
    }
    setHidden("passengerDetails", false);
    document.getElementById("passengerDetails")?.scrollIntoView({ behavior: "smooth" });
}

function handlePassengerForm() {
    const form = document.getElementById("passengerForm");
    if (!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById("fullName").value.trim();
        const age = parseInt(document.getElementById("age").value);
        const gender = document.getElementById("gender").value;
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim() || appState.user?.email || "";
        const idType = document.getElementById("idType").value;
        
        if (!fullName || !age || !gender || !phone) {
            alert("Please fill in all required fields.");
            return;
        }
        
        passengerData = {
            fullName,
            age,
            gender,
            phone,
            email,
            idType
        };
        
        setHidden("passengerDetails", true);
        displayPaymentPage();
    });
}

function displayPaymentPage() {
    const trip = appState.selectedTrip;
    if (!trip) return;
    
    const paymentRoute = document.getElementById("paymentRoute");
    const paymentDate = document.getElementById("paymentDate");
    const paymentSeats = document.getElementById("paymentSeats");
    const paymentPricePerSeat = document.getElementById("paymentPricePerSeat");
    const paymentSeatCount = document.getElementById("paymentSeatCount");
    const paymentTotal = document.getElementById("paymentTotal");
    
    if (paymentRoute) paymentRoute.textContent = `${trip.from} → ${trip.to}`;
    if (paymentDate) paymentDate.textContent = trip.date;
    if (paymentSeats) paymentSeats.textContent = appState.selectedSeats.join(", ");
    if (paymentPricePerSeat) paymentPricePerSeat.textContent = `UGX ${trip.price.toLocaleString()}`;
    if (paymentSeatCount) paymentSeatCount.textContent = appState.selectedSeats.length;
    
    const totalAmount = trip.price * appState.selectedSeats.length;
    if (paymentTotal) paymentTotal.textContent = `UGX ${totalAmount.toLocaleString()}`;
    
    setHidden("paymentPage", false);
    document.getElementById("paymentPage")?.scrollIntoView({ behavior: "smooth" });
}

function handlePayment() {
    const confirmBtn = document.getElementById("confirmPaymentBtn");
    if (!confirmBtn) return;
    
    // Handle payment method selection to show/hide forms
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardForm = document.getElementById("cardForm");
    const mobileForm = document.getElementById("mobileForm");
    const mobileHint = document.getElementById("mobileHint");
    
    paymentMethods.forEach(radio => {
        radio.addEventListener('change', () => {
            const value = radio.value;
            if (value === 'credit') {
                if (cardForm) cardForm.classList.remove("hidden");
                if (mobileForm) mobileForm.classList.add("hidden");
            } else if (value === 'mtn' || value === 'airtel') {
                if (cardForm) cardForm.classList.add("hidden");
                if (mobileForm) mobileForm.classList.remove("hidden");
                if (mobileHint) {
                    mobileHint.textContent = value === 'mtn' 
                        ? 'An MTN Mobile Money prompt will be sent to your phone.' 
                        : 'An Airtel Mobile Money prompt will be sent to your phone.';
                }
            }
        });
    });
    
    confirmBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        if (!appState.user) {
            openAuthModal("login");
            return;
        }
        
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }
        
        // Validate forms based on payment method
        if (paymentMethod.value === 'credit') {
            const cardNumber = document.getElementById("cardNumber").value.replace(/\s+/g, '');
            const cardExpiry = document.getElementById("cardExpiry").value;
            const cardCvv = document.getElementById("cardCvv").value;
            
            if (!cardNumber || cardNumber.length < 12) {
                alert("Please enter a valid card number.");
                return;
            }
            if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                alert("Please enter a valid expiry date (MM/YY).");
                return;
            }
            if (!cardCvv || !/^\d{3,4}$/.test(cardCvv)) {
                alert("Please enter a valid CVV.");
                return;
            }
        } else {
            const mobileNumber = document.getElementById("mobileNumber").value;
            if (!mobileNumber || !/^0\d{8,9}$/.test(mobileNumber)) {
                alert("Please enter a valid phone number.");
                return;
            }
        }
        
        const trip = appState.selectedTrip;
        if (!trip || !passengerData) {
            alert("Missing booking information. Please start over.");
            return;
        }
        
        // Build URL params for React payment page
        const params = new URLSearchParams({
            from: trip.from,
            to: trip.to,
            date: trip.date,
            seats: appState.selectedSeats.join(','),
            price: trip.price.toString(),
            total: (trip.price * appState.selectedSeats.length).toString(),
            company: trip.company || 'EA Coach',
            busId: trip.id || `bus-${Date.now()}`,
            departureTime: trip.time || '08:00'
        });
        
        // Redirect to React payment page
        window.location.href = `react-app.html#/payment?${params.toString()}`;
    });
}

function handleBookingSubmit() {
    // Legacy handler for old booking form (if exists)
    const form = document.getElementById("bookingForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Please use the new booking flow.");
        });
    }
}

// Simple Auth using localStorage
function loadAuth() {
    const raw = localStorage.getItem("ea_user");
    appState.user = raw ? JSON.parse(raw) : null;
    const bookingsRaw = localStorage.getItem("ea_bookings");
    appState.bookings = bookingsRaw ? JSON.parse(bookingsRaw) : [];
}

function saveAuth() {
    if (appState.user) localStorage.setItem("ea_user", JSON.stringify(appState.user));
    else localStorage.removeItem("ea_user");
}

function openAuthModal(mode) {
    const modal = document.getElementById("authModal");
    const title = document.getElementById("authTitle");
    const submitBtn = document.getElementById("authSubmitBtn");
    const toggleBtn = document.getElementById("toggleAuthMode");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    const setMode = (m) => {
        modal.setAttribute("data-mode", m);
        title.textContent = m === "signup" ? "Create Account" : "Login";
        submitBtn.textContent = m === "signup" ? "Sign Up" : "Login";
        toggleBtn.textContent = m === "signup" ? "Already have an account? Login" : "Create an account";
    };
    setMode(mode || "login");
}

function closeAuthModal() {
    const modal = document.getElementById("authModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

function handleAuth() {
    const loginOpen = document.getElementById("loginOpenBtn");
    if (loginOpen) loginOpen.addEventListener("click", () => openAuthModal("login"));
    const authClose = document.getElementById("authCloseBtn");
    if (authClose) authClose.addEventListener("click", closeAuthModal);
    const toggleMode = document.getElementById("toggleAuthMode");
    if (toggleMode) toggleMode.addEventListener("click", () => {
        const modal = document.getElementById("authModal");
        const mode = modal.getAttribute("data-mode") === "signup" ? "login" : "signup";
        openAuthModal(mode);
    });
    const authForm = document.getElementById("authForm");
    if (authForm) authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const modal = document.getElementById("authModal");
        const mode = modal.getAttribute("data-mode");
        const email = document.getElementById("authEmail").value.trim();
        const password = document.getElementById("authPassword").value.trim();
        if (mode === "signup") {
            // save user
            localStorage.setItem(`ea_user_${email}`, JSON.stringify({ email, password }));
            appState.user = { email };
            saveAuth();
            closeAuthModal();
            alert(`Welcome, ${email}!`);
            window.location.href = "index.html#home";
            return;
        }
        // login
        const raw = localStorage.getItem(`ea_user_${email}`);
        if (!raw) { alert("Account not found. Create an account first."); return; }
        const user = JSON.parse(raw);
        if (user.password !== password) { alert("Invalid credentials."); return; }
        appState.user = { email };
        saveAuth();
        closeAuthModal();
        alert(`Welcome back, ${email}!`);
        window.location.href = "index.html#home";
    });
}

// Admin
function handleAdmin() {
    const form = document.getElementById("adminAddTripForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const company = document.getElementById("adminCompany").value.trim() || BUS_COMPANIES[0];
        const to = document.getElementById("adminTo").value;
        const date = document.getElementById("adminDate").value;
        const time = document.getElementById("adminTime").value || "08:00";
        const price = parseInt(document.getElementById("adminPrice").value || "20000", 10);
        const seats = Array.from({ length: 45 }, (_, idx) => ({ seatNo: idx + 1, booked: false }));
        const trip = { id: `TX${Date.now()}`, company, from: "Kampala", to, date, time, price, seats };
        appState.trips.push(trip);
        renderAdminTrips();
        alert("Mock trip added.");
        form.reset();
    });
    renderAdminTrips();
}

function renderAdminTrips() {
    const container = document.getElementById("adminTripsContainer");
    if (!container) return;
    container.innerHTML = "";
    appState.trips.slice(0, 50).forEach((t) => {
        const d = document.createElement("div");
        d.className = "p-4 border rounded-lg flex items-center justify-between";
        d.innerHTML = `
            <div>
                <div class="font-bold">${t.company}</div>
                <div class="text-gray-600">${t.from} → ${t.to} • ${t.date} ${t.time}</div>
            </div>
            <div class="text-primary font-semibold">UGX ${t.price.toLocaleString()}</div>
        `;
        container.appendChild(d);
    });
}

function initNavLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            // Allow default scroll; additionally toggle section visibility where relevant
            const target = a.getAttribute("href").slice(1);
            if (["dashboard", "admin"].includes(target)) {
                setHidden(target, false);
            }
        });
    });
}

function init() {
    loadAuth();
    appState.trips = generateMockTrips();
    populateDestinations();
    handleSearchSubmit();
    handleSeatModalControls();
    handleBookingSubmit();
    handleBookingSummary();
    handlePassengerForm();
    handlePayment();
    handleAuth();
    handleAdmin();
    initNavLinks();
    
    // Check if there's a pending booking from sessionStorage (after redirect from index.html)
    const pendingBooking = sessionStorage.getItem('pendingBooking');
    if (pendingBooking) {
        try {
            const bookingData = JSON.parse(pendingBooking);
            appState.selectedTrip = bookingData.trip;
            appState.selectedSeats = bookingData.seats;
            sessionStorage.removeItem('pendingBooking');
            
            // Show booking summary automatically
            if (window.location.pathname.includes('booking.html') || window.location.pathname.endsWith('booking.html')) {
                setTimeout(() => {
                    displayBookingSummary();
                }, 300);
            }
        } catch (e) {
            console.error("Error restoring pending booking:", e);
        }
    }
    
    // Check for booking data from seats.html URL parameters
    if (window.location.pathname.includes('booking.html') || window.location.pathname.endsWith('booking.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const from = urlParams.get('from');
        const to = urlParams.get('to');
        const date = urlParams.get('date');
        const busId = urlParams.get('busId');
        const company = urlParams.get('company');
        const seatsParam = urlParams.get('seats');
        const price = urlParams.get('price');
        const total = urlParams.get('total');
        const departureTime = urlParams.get('departureTime');
        const arrivalTime = urlParams.get('arrivalTime');
        
        if (from && to && seatsParam) {
            // Create trip object from URL params
            const seatNumbers = seatsParam.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s));
            
            appState.selectedTrip = {
                id: busId || `bus-${Date.now()}`,
                company: company || 'Unknown Company',
                from: from,
                to: to,
                date: date,
                time: departureTime || '08:00',
                arrivalTime: arrivalTime || '14:00',
                price: parseInt(price) || 100000
            };
            
            appState.selectedSeats = seatNumbers;
            
            // Skip booking summary and go directly to passenger details
            setTimeout(() => {
                setHidden("search-results", true);
                setHidden("bookingSummary", true);
                displayPassengerForm();
            }, 300);
        }
    }
    // Enhance date input: min today and clickable trigger
    const dateInput = document.getElementById("date");
    if (dateInput) {
        const today = new Date();
        const min = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            .toISOString()
            .slice(0, 10);
        dateInput.min = min;
        const trigger = document.getElementById("dateTrigger");
        if (trigger) {
            trigger.addEventListener("click", () => {
                if (typeof dateInput.showPicker === "function") {
                    dateInput.showPicker();
                } else {
                    dateInput.focus();
                    dateInput.click();
                }
            });
        }
    }

    // Standalone auth pages handlers
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();
            const raw = localStorage.getItem(`ea_user_${email}`);
            if (!raw) { alert("Account not found. Please sign up."); return; }
            const user = JSON.parse(raw);
            if (user.password !== password) { alert("Invalid credentials."); return; }
            appState.user = { email };
            saveAuth();
            alert(`Welcome back, ${email}!`);
            window.location.href = "index.html#home";
        });
    }
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("signupEmail").value.trim();
            const password = document.getElementById("signupPassword").value.trim();
            const password2 = document.getElementById("signupPassword2").value.trim();
            if (password !== password2) { alert("Passwords do not match."); return; }
            localStorage.setItem(`ea_user_${email}`, JSON.stringify({ email, password }));
            appState.user = { email };
            saveAuth();
            alert(`Welcome, ${email}!`);
            window.location.href = "index.html#home";
        });
    }
}

document.addEventListener("DOMContentLoaded", init);


