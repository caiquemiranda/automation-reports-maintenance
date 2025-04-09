import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, ImageOverlay, Marker, Tooltip, Popup, useMap } from 'react-leaflet';
import { CRS, LatLngBounds, Icon, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapImagem from '../maps/map-1.png';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/pt-br';
import L from 'leaflet';

// Componente para controlar a visualização do mapa
function MapController({ coordY, coordX, deviceId, markerRefs }) {
    const map = useMap();

    useEffect(() => {
        if (coordY && coordX) {
            map.flyTo([coordY, coordX], 1);

            // Se temos um id de dispositivo e referências de marcadores, abrimos o popup
            if (deviceId && markerRefs.current && markerRefs.current[deviceId]) {
                markerRefs.current[deviceId].openPopup();

                // Mostrar o tooltip apenas para o dispositivo selecionado
                if (markerRefs.current[deviceId]._tooltip) {
                    markerRefs.current[deviceId]._tooltip.setOpacity(1);
                }
            }
        }
    }, [map, coordY, coordX, deviceId, markerRefs]);

    return null;
}

// Componente para mostrar as coordenadas do mouse
function MouseCoordinates({ mapRef, mapBounds }) {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const updateCoords = (e) => {
            // Converter as coordenadas do mapa para coordenadas da imagem
            const point = e.latlng;

            // Converter de coordenadas do mapa para pixels na imagem
            const y = Math.round(point.lat);
            const x = Math.round(point.lng);

            setCoords({ x, y });
        };

        map.on('mousemove', updateCoords);

        return () => {
            map.off('mousemove', updateCoords);
        };
    }, [map]);

    return (
        <div className="mouse-coordinates" style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '5px 10px',
            borderRadius: '4px',
            zIndex: 1000,
            fontSize: '12px',
            fontFamily: 'monospace'
        }}>
            X: {coords.x}, Y: {coords.y}
        </div>
    );
}

function Dispositivos() {
    const [dispositivos, setDispositivos] = useState([
        {
            id: 1,
            nome: 'N2-L23-DF-003',
            tipo: 'Sensor de Fumaça',
            status: 'Em operação',
            ultimaManutencao: '2024-10-14',
            coordX: 371,
            coordY: 386,
            historico: [
                { data: '2024-10-14', descricao: 'Manutenção preventiva realizada', tecnico: 'João Silva' },
                { data: '2024-05-02', descricao: 'Verificação de sensibilidade', tecnico: 'Carlos Mendes' },
                { data: '2023-11-20', descricao: 'Limpeza do sensor', tecnico: 'Ana Paula' }
            ]
        },
        {
            id: 2,
            nome: 'N2-L23-DF-006',
            tipo: 'Sensor de Fumaça',
            status: 'Em operação',
            ultimaManutencao: '2024-10-14',
            coordX: 379,
            coordY: 519,
            historico: [
                { data: '2024-10-14', descricao: 'Manutenção preventiva realizada', tecnico: 'Marcos Oliveira' },
                { data: '2024-04-15', descricao: 'Substituição da bateria', tecnico: 'Pedro Santos' }
            ]
        },
        {
            id: 3,
            nome: 'N2-L23-AM-006',
            tipo: 'Acionador Manual',
            status: 'Alerta',
            ultimaManutencao: '2024-10-14',
            coordX: 343,
            coordY: 140,
            historico: [
                { data: '2024-10-14', descricao: 'Verificação de comunicação', tecnico: 'Roberto Alves' },
                { data: '2024-10-14', descricao: 'Identificado erro de comunicação (Trouble No Answer)', tecnico: 'Roberto Alves' },
                { data: '2024-03-18', descricao: 'Manutenção preventiva', tecnico: 'Carla Mendes' }
            ]
        },
        {
            id: 4,
            nome: 'N2-L23-DF-034',
            tipo: 'Modulo de Monitoramento',
            status: 'Em operação',
            ultimaManutencao: '2024-10-14',
            coordX: 481,
            coordY: 35,
            historico: [
                { data: '2024-10-14', descricao: 'Atualização de firmware', tecnico: 'Rafael Costa' },
                { data: '2024-02-25', descricao: 'Verificação das conexões', tecnico: 'Sandra Duarte' }
            ]
        },
        {
            id: 5,
            nome: 'N2-L23-DF-056',
            tipo: 'Sensor de Fumaça',
            status: 'Em operação',
            ultimaManutencao: '2024-10-14',
            coordX: 280,
            coordY: 34,
            historico: [
                { data: '2024-10-14', descricao: 'Manutenção preventiva realizada', tecnico: 'Bruno Martins' },
                { data: '2024-05-10', descricao: 'Calibração do sensor', tecnico: 'Mariana Sousa' }
            ]
        },
        {
            id: 6,
            nome: 'N2-L23-DF-134',
            tipo: 'Sensor de Fumaça',
            status: 'Em operação',
            ultimaManutencao: '2024-10-14',
            coordX: 343,
            coordY: 108,
            historico: [
                { data: '2024-10-14', descricao: 'Manutenção preventiva realizada', tecnico: 'Fernanda Lima' },
                { data: '2024-06-03', descricao: 'Limpeza do sensor', tecnico: 'Gabriel Moraes' }
            ]
        }
    ]);

    const [dispositivosFiltrados, setDispositivosFiltrados] = useState([]);
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [tabAtiva, setTabAtiva] = useState('lista');
    const [dispositivoSelecionado, setDispositivoSelecionado] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [pesquisaCoord, setPesquisaCoord] = useState({ x: '', y: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [loaded, setLoaded] = useState(false);
    const markerRef = useRef({});
    const mapRef = useRef(null);
    const [selectedDispositivo, setSelectedDispositivo] = useState(null);
    const [mapImage, setMapImage] = useState(mapImagem);
    const mapBounds = new LatLngBounds([0, 0], [700, 1000]); // Define os limites da imagem [altura, largura]

    useEffect(() => {
        setDispositivosFiltrados(dispositivos);
    }, [dispositivos]);

    useEffect(() => {
        carregarDispositivos();
    }, []);

    const carregarDispositivos = () => {
        setLoaded(true);
    };

    const converterCoordenadas = (lat, lng) => {
        return [lat, lng];
    };

    function getIconByStatus(status) {
        let iconUrl = '';
        let iconColor = '#3388ff';

        // Definir cores baseadas no status
        switch (status) {
            case 'Em operação':
                iconColor = '#28a745'; // verde
                break;
            case 'Alerta':
                iconColor = '#ffc107'; // amarelo
                break;
            case 'Desativado':
                iconColor = '#dc3545'; // vermelho
                break;
            case 'Manutenção':
                iconColor = '#6c757d'; // cinza
                break;
            default:
                iconColor = '#3388ff'; // azul padrão
        }

        // Criar um ícone personalizado usando divIcon para maior flexibilidade
        return divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    }

    const renderMapView = () => {
        if (!loaded) {
            return (
                <div className="text-center mt-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            );
        }

        // Imprimir informações sobre o caminho da imagem para depuração
        console.log("Tentando carregar imagem:", mapImage);

        // Criar um ícone vermelho para o dispositivo selecionado
        const selectedIcon = divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #dc3545; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        return (
            <div className="map-container">
                <MapContainer
                    center={[350, 500]} // Centro da imagem
                    zoom={0}
                    style={{ height: '700px', width: '100%' }}
                    crs={CRS.Simple} // Importante: usar o CRS.Simple para coordenadas cartesianas
                    zoomControl={true}
                    ref={mapRef}
                    minZoom={-1}
                    maxZoom={2}
                >
                    <ImageOverlay
                        url={mapImage}
                        bounds={mapBounds}
                        opacity={1}
                        zIndex={10}
                        // Adicionar tratamento de erro para a imagem
                        eventHandlers={{
                            error: (e) => {
                                console.error("Erro ao carregar imagem:", e);
                                alert("Não foi possível carregar a imagem do mapa. Verifique o console para mais detalhes.");
                            }
                        }}
                    />

                    {/* Mostrar apenas o dispositivo selecionado */}
                    {selectedDeviceId && dispositivosFiltrados.map((dispositivo) => {
                        // Apenas renderizar o dispositivo selecionado
                        if (dispositivo.id !== selectedDeviceId) return null;

                        const posX = dispositivo.coordX || Math.random() * 900 + 50;
                        const posY = dispositivo.coordY || Math.random() * 600 + 50;
                        const posicao = converterCoordenadas(posY, posX);

                        return (
                            <Marker
                                key={dispositivo.id}
                                position={posicao}
                                icon={selectedIcon} // Sempre usar o ícone vermelho para o selecionado
                                ref={(ref) => {
                                    if (ref) {
                                        markerRef.current[dispositivo.id] = ref;
                                    }
                                }}
                                eventHandlers={{
                                    click: () => {
                                        setSelectedDispositivo(dispositivo);
                                        mostrarDetalhes(dispositivo);
                                    }
                                }}
                            >
                                {/* Tooltip sempre permanente para o dispositivo selecionado */}
                                <Tooltip
                                    direction="top"
                                    offset={[0, -20]}
                                    opacity={1}
                                    permanent={true}
                                >
                                    <span className="dispositivo-tooltip">
                                        {dispositivo.nome} ({dispositivo.tipo})
                                    </span>
                                </Tooltip>

                                {/* Popup com informações mais detalhadas ao clicar */}
                                <Popup>
                                    <div>
                                        <h4>{dispositivo.nome}</h4>
                                        <p><strong>Tipo:</strong> {dispositivo.tipo}</p>
                                        <p><strong>Status:</strong> {dispositivo.status}</p>
                                        <p><strong>Última Manutenção:</strong> {new Date(dispositivo.ultimaManutencao).toLocaleDateString('pt-BR')}</p>
                                        <button
                                            className="btn-details"
                                            onClick={() => mostrarDetalhes(dispositivo)}
                                            style={{
                                                padding: '5px 10px',
                                                backgroundColor: '#3498db',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* Controlador do mapa para centralizar nas coordenadas quando necessário */}
                    {mapCenter && (
                        <MapController
                            coordY={mapCenter[0]}
                            coordX={mapCenter[1]}
                            deviceId={selectedDeviceId}
                            markerRefs={markerRef}
                        />
                    )}

                    {/* Componente para mostrar as coordenadas do mouse */}
                    <MouseCoordinates mapRef={mapRef} mapBounds={mapBounds} />
                </MapContainer>
            </div>
        );
    };

    const handleRowClick = (dispositivo) => {
        setSelectedDispositivo(dispositivo);
        if (markerRef.current[dispositivo.id] && mapRef.current) {
            const marker = markerRef.current[dispositivo.id];
            const map = mapRef.current;

            const posicao = marker.getLatLng();

            map.setView(posicao, 1);

            marker.openPopup();
        }
    };

    const aplicarFiltros = () => {
        let dispositivosFiltrados = [...dispositivos];

        if (filtroTipo) {
            dispositivosFiltrados = dispositivosFiltrados.filter(dispositivo => dispositivo.tipo === filtroTipo);
        }

        if (filtroStatus) {
            dispositivosFiltrados = dispositivosFiltrados.filter(dispositivo => dispositivo.status === filtroStatus);
        }

        setDispositivosFiltrados(dispositivosFiltrados);
    };

    // Função para apenas mostrar os detalhes do dispositivo
    const mostrarDetalhes = (dispositivo) => {
        setDispositivoSelecionado(dispositivo);
        setTabAtiva('detalhes');
    };

    // Função para mostrar o dispositivo no mapa
    const localizarNoMapa = (dispositivo) => {
        setDispositivoSelecionado(dispositivo);

        // Armazenar as coordenadas e o ID do dispositivo para o MapController
        setMapCenter([dispositivo.coordY, dispositivo.coordX]);
        setSelectedDeviceId(dispositivo.id);

        // Mudar para a aba do mapa
        setTabAtiva('mapa');
    };

    const pesquisarPorCoordenadas = () => {
        setErrorMessage('');

        const x = parseInt(pesquisaCoord.x);
        const y = parseInt(pesquisaCoord.y);

        if (isNaN(x) || isNaN(y)) {
            setErrorMessage('Coordenadas inválidas. Por favor, insira números válidos.');
            return;
        }

        if (x < 0 || x > 1000 || y < 0 || y > 700) {
            setErrorMessage('Coordenadas fora dos limites do mapa (X: 0-1000, Y: 0-700).');
            return;
        }

        const dispositivoProximo = dispositivos.find(dispositivo => {
            const distancia = Math.sqrt(
                Math.pow(dispositivo.coordX - x, 2) +
                Math.pow(dispositivo.coordY - y, 2)
            );
            return distancia < 50;
        });

        if (dispositivoProximo) {
            localizarNoMapa(dispositivoProximo);
        } else {
            if (mapRef.current) {
                mapRef.current.setView([y, x], 1);
            }
            setErrorMessage('Nenhum dispositivo encontrado nessas coordenadas.');
        }
    };

    return (
        <div className="content">
            <h2>Mapa de Dispositivos</h2>

            <div className="tab-container">
                <div className="tabs">
                    <button
                        className={`tab ${tabAtiva === 'mapa' ? 'active' : ''}`}
                        onClick={() => setTabAtiva('mapa')}
                    >
                        Mapa
                    </button>
                    <button
                        className={`tab ${tabAtiva === 'lista' ? 'active' : ''}`}
                        onClick={() => setTabAtiva('lista')}
                    >
                        Lista
                    </button>
                    {dispositivoSelecionado && (
                        <button
                            className={`tab ${tabAtiva === 'detalhes' ? 'active' : ''}`}
                            onClick={() => setTabAtiva('detalhes')}
                        >
                            Detalhes
                        </button>
                    )}
                </div>

                <div className="tab-content">
                    {tabAtiva === 'mapa' && (
                        <>
                            <div className="form-container">
                                <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                    <div style={{ flex: 1 }}>
                                        <label>Coordenada X:</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="1000"
                                            value={pesquisaCoord.x}
                                            onChange={(e) => setPesquisaCoord({ ...pesquisaCoord, x: e.target.value })}
                                            placeholder="0-1000"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label>Coordenada Y:</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="700"
                                            value={pesquisaCoord.y}
                                            onChange={(e) => setPesquisaCoord({ ...pesquisaCoord, y: e.target.value })}
                                            placeholder="0-700"
                                        />
                                    </div>
                                    <button
                                        className="btn-submit"
                                        onClick={pesquisarPorCoordenadas}
                                        style={{ marginBottom: '1px' }}
                                    >
                                        Pesquisar
                                    </button>
                                </div>
                                {errorMessage && <p style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</p>}
                            </div>
                            {renderMapView()}
                            <p className="map-info">
                                O mapa mostra a localização dos dispositivos de monitoramento. Apenas o dispositivo selecionado é exibido. Utilize a lista ou a busca por coordenadas para localizar um dispositivo específico.
                            </p>
                        </>
                    )}

                    {tabAtiva === 'lista' && (
                        <>
                            <div className="table-filters">
                                <div className="filter-group">
                                    <label>Filtrar por Tipo:</label>
                                    <select
                                        value={filtroTipo}
                                        onChange={(e) => setFiltroTipo(e.target.value)}
                                    >
                                        <option value="">Todos</option>
                                        <option value="Sensor de Fumaça">Sensor de Fumaça</option>
                                        <option value="Acionador Manual">Acionador Manual</option>
                                        <option value="Modulo de Monitoramento">Módulo de Monitoramento</option>
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label>Filtrar por Status:</label>
                                    <select
                                        value={filtroStatus}
                                        onChange={(e) => setFiltroStatus(e.target.value)}
                                    >
                                        <option value="">Todos</option>
                                        <option value="Em operação">Normal</option>
                                        <option value="Alerta">Trouble No Answer</option>
                                        <option value="Desativado">Desativado</option>
                                        <option value="Manutenção">Em Manutenção</option>
                                    </select>
                                </div>
                                <button className="btn-filter" onClick={aplicarFiltros}>
                                    Aplicar Filtros
                                </button>
                            </div>

                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Tipo</th>
                                        <th>Status</th>
                                        <th>Última Manutenção</th>
                                        <th>Coordenadas</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dispositivosFiltrados.map((dispositivo) => (
                                        <tr key={dispositivo.id}>
                                            <td>{dispositivo.nome}</td>
                                            <td>{dispositivo.tipo}</td>
                                            <td>
                                                <span className={`badge ${dispositivo.status === 'Em operação' ? 'badge-completed' :
                                                    dispositivo.status === 'Alerta' ? 'badge-medium' :
                                                        dispositivo.status === 'Desativado' ? 'badge-waiting' :
                                                            'badge-progress'
                                                    }`}>
                                                    {dispositivo.status}
                                                </span>
                                            </td>
                                            <td>{new Date(dispositivo.ultimaManutencao).toLocaleDateString('pt-BR')}</td>
                                            <td>X: {dispositivo.coordX}, Y: {dispositivo.coordY}</td>
                                            <td>
                                                <button
                                                    className="btn-action"
                                                    title="Ver detalhes"
                                                    onClick={() => mostrarDetalhes(dispositivo)}
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button
                                                    className="btn-action"
                                                    title="Localizar no mapa"
                                                    onClick={() => localizarNoMapa(dispositivo)}
                                                >
                                                    <i className="fas fa-map-marker-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {tabAtiva === 'detalhes' && dispositivoSelecionado && (
                        <div className="device-details">
                            <h3>{dispositivoSelecionado.nome}</h3>
                            <p><strong>Tipo:</strong> {dispositivoSelecionado.tipo}</p>
                            <p><strong>Status:</strong> {dispositivoSelecionado.status}</p>
                            <p><strong>Última Manutenção:</strong> {new Date(dispositivoSelecionado.ultimaManutencao).toLocaleDateString('pt-BR')}</p>
                            <p><strong>Coordenadas:</strong> X: {dispositivoSelecionado.coordX}, Y: {dispositivoSelecionado.coordY}</p>

                            <h4 className="mt-4">Histórico de Manutenção</h4>
                            <div className="device-history">
                                {dispositivoSelecionado.historico.map((item, index) => (
                                    <div className="history-item" key={index}>
                                        <span className="history-date">{new Date(item.data).toLocaleDateString('pt-BR')}</span>
                                        <p><strong>Descrição:</strong> {item.descricao}</p>
                                        <p><strong>Técnico:</strong> {item.tecnico}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <button
                                    className="btn-submit"
                                    onClick={() => localizarNoMapa(dispositivoSelecionado)}
                                >
                                    Localizar no Mapa
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dispositivos; 