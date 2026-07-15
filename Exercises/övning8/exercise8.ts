
        // 1. Inställningar (Anpassad till din HTTPS-port från Visual Studio)
        const API_URL = "http://localhost:5030/api/cars";

        // 2. DOM-referenser
document.addEventListener("DOMContentLoaded", () => {
    const loadBtn = document.querySelector('#load-btn') as HTMLButtonElement;
    const submitBtn = document.querySelector('#submit-btn') as HTMLButtonElement;


    if (loadBtn) {
        loadBtn.addEventListener('click', fetchCars);
    }
    if (submitBtn) {
        submitBtn.addEventListener('click', addCar);
    }
})  

        const carList = document.querySelector('#car-list')  as HTMLDivElement;
        const carForm = document.querySelector('#car-form') as HTMLFormElement;
        const carIdInput = document.querySelector('#car-id') as HTMLInputElement;
        const formTitle = document.querySelector('#form-title') as HTMLHeadingElement;
        const cancelBtn = document.querySelector('#cancel-btn') as HTMLButtonElement;

            const newBrand = document.querySelector('#brand') as HTMLInputElement;
            const newModel = document.querySelector('#model') as HTMLInputElement;
            const newYear = document.querySelector('#year') as HTMLInputElement;
            const newColor = document.querySelector('#color') as HTMLInputElement;


        // ==========================================
        // 🟢 Interface: ICar
        // ==========================================
        interface ICar {
            id?: number;
            brand: string;
            model: string;
            year: number;
            color: string;
        }

        // ==========================================
        // 🟢 READ (GET) - Hämta och visa alla bilar
        // ==========================================
        const fetchCars = async () => {
            console.log("Pressed fetch cars");
            try {
                const response = await fetch(API_URL);
                
                if (!response.ok) {
                    throw new Error(`Fel vid hämtning: ${response.status}`);
                }

                const cars = await response.json();
                
                // Töm listan innan vi ritar ut på nytt
                carList.replaceChildren();

                if (cars.length === 0) {
                    carList.innerHTML = "<p>Det finns inga bilar i databasen.</p>";
                    return;
                }

                // Loopa igenom bilarna och bygg HTML för varje kort
                cars.forEach((car: { brand: any; model: any; year: any; color: any; id: any; }) => {
                    const card = document.createElement('div');
                    card.className = 'car-card';
                    card.innerHTML = `
                        <div>
                            <strong>${car.brand} ${car.model}</strong> (${car.year}) <br>
                            <span style="font-size: 0.9rem; color: #777;">Färg: ${car.color}</span>
                        </div>
                        <div class="btn-group">
                            <button class="outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="prepareEdit(${JSON.stringify(car).replace(/"/g, '&quot;')})">Redigera</button>
                            <button class="outline contrast" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="deleteCar(${car.id})">Ta bort</button>
                        </div>
                    `;
                    carList.appendChild(card);
                });

            } catch (error) {
                console.error("Fel:", error);
                carList.innerHTML = `<p style="color: red;">Kunde inte hämta bilar. Körs ditt API på ${API_URL}?</p>`;
            }
        };

        // ==========================================
        // 🟢 ADD (POST) - Lägg till ny bil till listan
        // ==========================================
        const addCar = async () => {
                        console.log("Pressed add cars");

            //event.preventDefault();

            const nyBil: ICar = {
                brand: newBrand.value as string,
                model: newModel.value as string,
                year: newYear.valueAsNumber as number,
                color: newColor.value as string
            }

            console.log(nyBil);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nyBil)
            });
            const data = await response.json();
        
            console.log("Kod:", response.status);
            console.log("Data:", data);

            fetchCars();

        };


        // ==========================================
        // 🟢 Delete (DELETE) - Ta bort vald bil
        // ==========================================
        const deleteCar = async (carId: any) => {
            const response = await fetch(`${API_URL}/${carId}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            console.log("Statuskod:", response.status);
            console.log("Svar från server:", data);

            fetchCars();
        };

        // ==========================================
        // 🟢 Update (PUT) - Uppdatera vald bil
        // ==========================================
        const prepareEdit = async (car: { id: any; }) => {

            console.log(car.id);

            const updCar: ICar = {
                id: car.id,
                brand: newBrand.value as string,
                model: newModel.value as string,
                year: newYear.valueAsNumber as number,
                color: newColor.value as string
            };

            const response = await fetch(`${API_URL}/${car.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updCar)
            });

            console.log("Statuskod:", response.status);

            fetchCars();
        };

        // Event listener för ladda-knappen


