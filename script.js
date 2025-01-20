const ratePerKm = 3.00; // Valor fixo por km (em reais)

// URLs da API do IBGE
const statesApiUrl = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
const citiesApiUrl = (stateId) => `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`;

const stateNames = {
    AC: 'Acre',
    AL: 'Alagoas',
    AP: 'Amapá',
    AM: 'Amazonas',
    BA: 'Bahia',
    CE: 'Ceará',
    DF: 'Distrito Federal',
    ES: 'Espírito Santo',
    GO: 'Goiás',
    MA: 'Maranhão',
    MT: 'Mato Grosso',
    MS: 'Mato Grosso do Sul',
    MG: 'Minas Gerais',
    PA: 'Pará',
    PB: 'Paraíba',
    PR: 'Paraná',
    PE: 'Pernambuco',
    PI: 'Piauí',
    RJ: 'Rio de Janeiro',
    RN: 'Rio Grande do Norte',
    RS: 'Rio Grande do Sul',
    RO: 'Rondônia',
    RR: 'Roraima',
    SC: 'Santa Catarina',
    SP: 'São Paulo',
    SE: 'Sergipe',
    TO: 'Tocantins'
    // Adicione mais estados conforme necessário
};


// Quando precisar do nome completo:
const selectedState = document.getElementById('origin-state').value;
const fullName = stateNames[selectedState];
console.log(`O estado selecionado foi: ${fullName}`);

// Carregar estados na inicialização
window.addEventListener('DOMContentLoaded', loadStates);

function loadStates() {
    fetch(statesApiUrl)
        .then(response => response.json())
        .then(states => {
            const originStateSelect = document.getElementById('origin-state');
            const destinationStateSelect = document.getElementById('destination-state');

            // Adiciona os estados em ambos os campos
            states.forEach(state => {
                const option = document.createElement('option');
                option.value = state.sigla; // Sigla do estado (ex: SP, RJ)
                option.textContent = state.sigla; // Nome completo do estado

                originStateSelect.appendChild(option);
                destinationStateSelect.appendChild(option.cloneNode(true)); // Clona o elemento
            });
        })
        .catch(error => console.error("Erro ao carregar estados:", error));
        
}

// Atualizar as cidades ao selecionar um estado
// Atualizar as cidades ao selecionar um estado
document.getElementById('origin-state').addEventListener('change', (event) => updateCities(event, 'origin-city'));
document.getElementById('destination-state').addEventListener('change', (event) => updateCities(event, 'destination-city'));

// Função para atualizar as cidades com base no estado
function updateCities(event, citySelectId) {
    const stateSigla = event.target.value;
    const citySelect = document.getElementById(citySelectId);

    // Limpa as opções anteriores
    citySelect.innerHTML = '<option value="">Selecione uma cidade</option>';

    if (!stateSigla) return; // Sai se nenhum estado foi selecionado

    // Busca cidades do estado selecionado
    fetch(citiesApiUrl(stateSigla))
        .then(response => response.json())
        .then(cities => {
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.nome; // Nome da cidade
                option.textContent = city.nome; // Nome da cidade

                citySelect.appendChild(option);
            });
        })
        .catch(error => console.error("Erro ao carregar cidades:", error));
}

// Calcular a distância e custo (ida e volta)
document.getElementById('calculate').addEventListener('click', () => {
    const origin = document.getElementById('origin-city').value;
    const destination = document.getElementById('destination-city').value;

    if (!origin || !destination) {
        alert('Por favor, selecione a cidade de origem e destino.');
        return;
    }

    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
        },
        (response, status) => {
            if (status === 'OK') {
                const distanceText = response.rows[0].elements[0].distance.text;
                const distanceValue = response.rows[0].elements[0].distance.value; // em metros

                const distanceKm = distanceValue / 1000; // Convertendo para quilômetros
                const roundTripDistance = distanceKm * 2; // Ida e volta
                const cost = (roundTripDistance * ratePerKm).toFixed(2); // Multiplica por 2 para ida e volta

                // Exibe os resultados no DOM
                document.getElementById('result').textContent = 
                    `Distância (ida e volta): ${roundTripDistance.toFixed(2)} km - Custo estimado: R$ ${cost}`;
            } else {
                alert('Não foi possível calcular a distância. Verifique os dados.');
            }
        }
    );
});



const images = document.querySelectorAll('.slider img');
let currentIndex = 0;

function showNextImage() {
    images[currentIndex].classList.remove('active'); // Remove a classe da imagem atual
    currentIndex = (currentIndex + 1) % images.length; // Avança para a próxima imagem
    images[currentIndex].classList.add('active'); // Adiciona a classe à próxima imagem
}

// Alterna as imagens a cada 3 segundos
setInterval(showNextImage, 5000);

function showImage(index) {
    images[currentIndex].classList.remove('active'); // Remove a classe da imagem atual
    currentIndex = (index + images.length) % images.length; // Ajusta o índice para evitar valores inválidos
    images[currentIndex].classList.add('active'); // Adiciona a classe à nova imagem
}

function nextImage() {
    showImage(currentIndex + 1);
}

function prevImage() {
    showImage(currentIndex - 1);
}

// Manter o slider automático funcionando
setInterval(() => {
    showImage(currentIndex + 1);
}, 5000);
