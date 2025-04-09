import React, { useState, useEffect, useRef } from 'react';

function Dispositivos() {
    const [activeTab, setActiveTab] = useState('localizacao');
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [deviceDetails, setDeviceDetails] = useState({
        id: '',
        name: '',
        type: '',
        location: '',
        status: '',
        installDate: '',
        lastMaintenance: ''
    });
    const [filterTipo, setFilterTipo] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDispositivo, setFilterDispositivo] = useState('');
    const [filterTipoEvento, setFilterTipoEvento] = useState('');

    const mapRef = useRef(null);
    const leafletRef = useRef(null);
    const markersRef = useRef({});

    const dispositivos = [
        {
            id: 'D001',
            nome: 'Sensor de Temperatura',
            tipo: 'sensor',
            status: 'ativo',
            localizacao: 'Sala de Máquinas',
            lat: -23.550520,
            lng: -46.633308,
            dataInstalacao: '01/01/2023',
            ultimaManutencao: '15/01/2024'
        },
        {
            id: 'D002',
            nome: 'Controlador de Pressão',
            tipo: 'controlador',
            status: 'manutencao',
            localizacao: 'Linha de Produção',
            lat: -23.551520,
            lng: -46.634308,
            dataInstalacao: '05/03/2023',
            ultimaManutencao: '20/01/2024'
        },
        {
            id: 'D003',
            nome: 'Atuador Hidráulico',
            tipo: 'atuador',
            status: 'ativo',
            localizacao: 'Linha de Montagem',
            lat: -23.552520,
            lng: -46.635308,
            dataInstalacao: '10/06/2023',
            ultimaManutencao: '05/02/2024'
        },
        {
            id: 'D004',
            nome: 'Sensor de Vibração',
            tipo: 'sensor',
            status: 'inativo',
            localizacao: 'Motor Principal',
            lat: -23.553520,
            lng: -46.636308,
            dataInstalacao: '15/08/2023',
            ultimaManutencao: '10/02/2024'
        }
    ];

    const historico = [
        {
            data: '15/01/2024',
            dispositivo: 'D001',
            dispositivoNome: 'Sensor de Temperatura',
            evento: 'calibracao',
            descricao: 'Calibração semestral programada',
            tecnico: 'João Silva'
        },
        {
            data: '20/01/2024',
            dispositivo: 'D002',
            dispositivoNome: 'Controlador de Pressão',
            evento: 'manutencao',
            descricao: 'Substituição de válvula de controle',
            tecnico: 'Maria Santos'
        },
        {
            data: '05/02/2024',
            dispositivo: 'D003',
            dispositivoNome: 'Atuador Hidráulico',
            evento: 'falha',
            descricao: 'Vazamento de óleo identificado',
            tecnico: 'Carlos Pereira'
        },
        {
            data: '10/02/2024',
            dispositivo: 'D004',
            dispositivoNome: 'Sensor de Vibração',
            evento: 'substituicao',
            descricao: 'Substituição de sensor com defeito',
            tecnico: 'Ana Oliveira'
        },
        {
            data: '15/02/2024',
            dispositivo: 'D002',
            dispositivoNome: 'Controlador de Pressão',
            evento: 'manutencao',
            descricao: 'Ajuste de parâmetros de controle',
            tecnico: 'Pedro Souza'
        }
    ];

    useEffect(() => {
        // Inicializar o mapa quando o componente for montado
        // e limpa-lo quando o componente for desmontado
        let map = null;

        // Verifica se a biblioteca Leaflet já foi carregada
        if (typeof window.L !== 'undefined' && mapRef.current && !leafletRef.current) {
            // Inicializa o mapa
            map = window.L.map(mapRef.current).setView([-23.550520, -46.633308], 13);

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Adiciona marcadores para cada dispositivo
            dispositivos.forEach(dispositivo => {
                const marker = window.L.marker([dispositivo.lat, dispositivo.lng]).addTo(map);
                marker.bindPopup(`<b>${dispositivo.nome}</b><br>ID: ${dispositivo.id}`);

                marker.on('click', function () {
                    mostrarDetalhes(dispositivo.id);
                });

                markersRef.current[dispositivo.id] = marker;
            });

            leafletRef.current = map;
        }

        // Função de limpeza quando o componente for desmontado
        return () => {
            if (leafletRef.current) {
                leafletRef.current.remove();
                leafletRef.current = null;
            }
        };
    }, []);

    // Função para carregar o script do Leaflet
    useEffect(() => {
        if (typeof window.L === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
            script.async = true;
            document.body.appendChild(script);

            // Quando o script for carregado, inicializa o mapa
            script.onload = () => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
                document.head.appendChild(link);
            };

            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);

    const openTab = (tabName) => {
        setActiveTab(tabName);
    };

    const filterDevices = () => {
        return dispositivos.filter(dispositivo => {
            const tipoMatch = !filterTipo || dispositivo.tipo === filterTipo;
            const statusMatch = !filterStatus || dispositivo.status === filterStatus;
            return tipoMatch && statusMatch;
        });
    };

    const filterHistory = () => {
        return historico.filter(item => {
            const dispositivoMatch = !filterDispositivo || item.dispositivo === filterDispositivo;
            const eventoMatch = !filterTipoEvento || item.evento === filterTipoEvento;
            return dispositivoMatch && eventoMatch;
        });
    };

    const mostrarDispositivo = (id) => {
        const marker = markersRef.current[id];
        if (marker && leafletRef.current) {
            leafletRef.current.setView(marker.getLatLng(), 15);
            marker.openPopup();
        }
    };

    const mostrarDetalhes = (id) => {
        const dispositivo = dispositivos.find(d => d.id === id);
        if (dispositivo) {
            setSelectedDeviceId(id);
            setDeviceDetails({
                id: dispositivo.id,
                name: dispositivo.nome,
                type: dispositivo.tipo,
                location: dispositivo.localizacao,
                status: dispositivo.status,
                installDate: dispositivo.dataInstalacao,
                lastMaintenance: dispositivo.ultimaManutencao
            });
        }
    };

    // Função para obter o histórico de um dispositivo específico
    const getDeviceHistory = (id) => {
        return historico.filter(item => item.dispositivo === id);
    };

    // Função para renderizar o badge de status
    const renderStatusBadge = (status) => {
        let badgeClass = 'badge ';
        let statusText = '';

        switch (status) {
            case 'ativo':
                badgeClass += 'badge-completed';
                statusText = 'Ativo';
                break;
            case 'inativo':
                badgeClass += 'badge-high';
                statusText = 'Inativo';
                break;
            case 'manutencao':
                badgeClass += 'badge-waiting';
                statusText = 'Em Manutenção';
                break;
            default:
                badgeClass += 'badge-low';
                statusText = status;
        }

        return <span className={badgeClass}>{statusText}</span>;
    };

    return (
        <div>
            <h2>Mapa de Dispositivos</h2>

            <div className="tab-container">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'localizacao' ? 'active' : ''}`}
                        onClick={() => openTab('localizacao')}
                    >
                        Localização
                    </button>
                    <button
                        className={`tab ${activeTab === 'historico' ? 'active' : ''}`}
                        onClick={() => openTab('historico')}
                    >
                        Histórico
                    </button>
                </div>

                <div id="localizacao" className="tab-content" style={{ display: activeTab === 'localizacao' ? 'block' : 'none' }}>
                    <div className="map-container">
                        <div id="map" ref={mapRef} style={{ height: '400px', width: '100%', zIndex: 1 }}></div>
                    </div>

                    <div className="table-container">
                        <h3>Lista de Dispositivos</h3>
                        <div className="table-filters">
                            <div className="filter-group">
                                <label htmlFor="filterTipo">Tipo:</label>
                                <select
                                    id="filterTipo"
                                    value={filterTipo}
                                    onChange={(e) => setFilterTipo(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    <option value="sensor">Sensor</option>
                                    <option value="controlador">Controlador</option>
                                    <option value="atuador">Atuador</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label htmlFor="filterStatus">Status:</label>
                                <select
                                    id="filterStatus"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                    <option value="manutencao">Em Manutenção</option>
                                </select>
                            </div>
                        </div>
                        <table className="data-table" id="dispositivos-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Tipo</th>
                                    <th>Localização</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterDevices().map(dispositivo => (
                                    <tr key={dispositivo.id}>
                                        <td>{dispositivo.id}</td>
                                        <td>{dispositivo.nome}</td>
                                        <td>{dispositivo.tipo.charAt(0).toUpperCase() + dispositivo.tipo.slice(1)}</td>
                                        <td>{dispositivo.localizacao}</td>
                                        <td>{renderStatusBadge(dispositivo.status)}</td>
                                        <td>
                                            <button className="btn-action" onClick={() => mostrarDispositivo(dispositivo.id)}>
                                                <i className="fas fa-map-marker-alt"></i>
                                            </button>
                                            <button className="btn-action" onClick={() => mostrarDetalhes(dispositivo.id)}>
                                                <i className="fas fa-info-circle"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="historico" className="tab-content" style={{ display: activeTab === 'historico' ? 'block' : 'none' }}>
                    <div className="table-container">
                        <h3>Histórico de Dispositivos</h3>
                        <div className="table-filters">
                            <div className="filter-group">
                                <label htmlFor="filterDispositivo">Dispositivo:</label>
                                <select
                                    id="filterDispositivo"
                                    value={filterDispositivo}
                                    onChange={(e) => setFilterDispositivo(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {dispositivos.map(d => (
                                        <option key={d.id} value={d.id}>{d.id} - {d.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label htmlFor="filterTipoEvento">Tipo de Evento:</label>
                                <select
                                    id="filterTipoEvento"
                                    value={filterTipoEvento}
                                    onChange={(e) => setFilterTipoEvento(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    <option value="manutencao">Manutenção</option>
                                    <option value="calibracao">Calibração</option>
                                    <option value="falha">Falha</option>
                                    <option value="substituicao">Substituição</option>
                                </select>
                            </div>
                        </div>
                        <table className="data-table" id="historico-table">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Dispositivo</th>
                                    <th>Evento</th>
                                    <th>Descrição</th>
                                    <th>Técnico</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterHistory().map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.data}</td>
                                        <td>{item.dispositivo} - {item.dispositivoNome}</td>
                                        <td>{item.evento.charAt(0).toUpperCase() + item.evento.slice(1)}</td>
                                        <td>{item.descricao}</td>
                                        <td>{item.tecnico}</td>
                                        <td>
                                            <button className="btn-action">
                                                <i className="fas fa-file-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detalhes do Dispositivo */}
            {selectedDeviceId && (
                <div id="device-details" className="device-details" style={{ display: 'block' }}>
                    <h3 id="device-title">Detalhes do Dispositivo: {deviceDetails.name}</h3>
                    <div className="device-info">
                        <p><strong>ID:</strong> {deviceDetails.id}</p>
                        <p><strong>Nome:</strong> {deviceDetails.name}</p>
                        <p><strong>Tipo:</strong> {deviceDetails.type.charAt(0).toUpperCase() + deviceDetails.type.slice(1)}</p>
                        <p><strong>Localização:</strong> {deviceDetails.location}</p>
                        <p><strong>Status:</strong> {deviceDetails.status.charAt(0).toUpperCase() + deviceDetails.status.slice(1)}</p>
                        <p><strong>Data de Instalação:</strong> {deviceDetails.installDate}</p>
                        <p><strong>Última Manutenção:</strong> {deviceDetails.lastMaintenance}</p>
                    </div>

                    <h4>Histórico Recente</h4>
                    <div id="device-history" className="device-history">
                        {getDeviceHistory(selectedDeviceId).length > 0 ? (
                            getDeviceHistory(selectedDeviceId).map((item, index) => (
                                <div key={index} className="history-item">
                                    <p><span className="history-date">{item.data}</span> - <strong>{item.evento.charAt(0).toUpperCase() + item.evento.slice(1)}</strong></p>
                                    <p>{item.descricao}</p>
                                    <p>Técnico: {item.tecnico}</p>
                                </div>
                            ))
                        ) : (
                            <p>Nenhum histórico encontrado para este dispositivo.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dispositivos; 