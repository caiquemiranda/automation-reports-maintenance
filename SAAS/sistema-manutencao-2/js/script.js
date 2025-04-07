document.addEventListener('DOMContentLoaded', function () {
    // Toggle da Sidebar
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('sidebar-collapsed');
            mainContent.classList.toggle('main-content-expanded');
        });
    }

    // Toggle dos Submenus
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');

    hasSubmenuItems.forEach(function (item) {
        const link = item.querySelector('a');
        if (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                item.classList.toggle('active');
            });
        }
    });

    // Fechar sidebar ao clicar fora em telas pequenas
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('active');
            }
        }
    });

    // Tabs functionality
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabContainer = button.closest('.tab-container');
            const tabId = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabContainer.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });

            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const content = tabContainer.querySelector(`.tab-content[data-tab="${tabId}"]`);
            if (content) {
                content.classList.add('active');
            }
        });
    });

    // Modal funcionality
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const closeButtons = document.querySelectorAll('[data-close-button]');
    const overlay = document.getElementById('overlay');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modal = document.querySelector(trigger.dataset.modalTarget);
            openModal(modal);
        });
    });

    if (overlay) {
        overlay.addEventListener('click', () => {
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => {
                closeModal(modal);
            });
        });
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    function openModal(modal) {
        if (modal == null) return;
        modal.classList.add('active');
        if (overlay) overlay.classList.add('active');
    }

    function closeModal(modal) {
        if (modal == null) return;
        modal.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    // Dropdown para perfil, configurações e ajuda
    const profileIcon = document.getElementById('profile-icon');
    const settingsIcon = document.getElementById('settings-icon');
    const helpIcon = document.getElementById('help-icon');

    // Criação dinâmica dos dropdowns
    if (profileIcon) {
        createProfileDropdown(profileIcon);
    }

    if (settingsIcon) {
        createSettingsDropdown(settingsIcon);
    }

    if (helpIcon) {
        createHelpDropdown(helpIcon);
    }

    // Função para criar o dropdown de perfil
    function createProfileDropdown(icon) {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';

        const profileContent = document.createElement('div');
        profileContent.className = 'dropdown-content';

        // Cabeçalho do perfil
        const profileHeader = document.createElement('div');
        profileHeader.className = 'profile-header';

        const profileImg = document.createElement('div');
        profileImg.className = 'profile-img';
        profileImg.innerHTML = '<img src="../assets/profile-placeholder.jpg" alt="Perfil" onerror="this.src=\'https://via.placeholder.com/60\'">';

        const profileName = document.createElement('div');
        profileName.className = 'profile-name';
        profileName.textContent = 'João da Silva';

        const profileRole = document.createElement('div');
        profileRole.className = 'profile-role';
        profileRole.textContent = 'Técnico de Manutenção';

        profileHeader.appendChild(profileImg);
        profileHeader.appendChild(profileName);
        profileHeader.appendChild(profileRole);

        // Links do perfil
        const links = [
            { text: 'Meu Perfil', href: 'perfil.html' },
            { text: 'Minhas Tarefas', href: 'tarefas.html' },
            { text: 'Configurações', href: 'configuracoes.html' },
            { text: 'Sair', href: '../index.html' }
        ];

        profileContent.appendChild(profileHeader);

        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.text;
            profileContent.appendChild(a);
        });

        // Substituir o ícone pelo dropdown
        const parentElement = icon.parentElement;
        dropdown.appendChild(icon.cloneNode(true));
        dropdown.appendChild(profileContent);

        parentElement.replaceChild(dropdown, icon);
    }

    // Função para criar o dropdown de configurações
    function createSettingsDropdown(icon) {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';

        const settingsContent = document.createElement('div');
        settingsContent.className = 'dropdown-content';

        const links = [
            { text: 'Configurações Gerais', href: 'configuracoes.html' },
            { text: 'Aparência', href: 'configuracoes-aparencia.html' },
            { text: 'Notificações', href: 'configuracoes-notificacoes.html' },
            { text: 'Segurança', href: 'configuracoes-seguranca.html' }
        ];

        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.text;
            settingsContent.appendChild(a);
        });

        // Substituir o ícone pelo dropdown
        const parentElement = icon.parentElement;
        dropdown.appendChild(icon.cloneNode(true));
        dropdown.appendChild(settingsContent);

        parentElement.replaceChild(dropdown, icon);
    }

    // Função para criar o dropdown de ajuda
    function createHelpDropdown(icon) {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';

        const helpContent = document.createElement('div');
        helpContent.className = 'dropdown-content';

        const links = [
            { text: 'Central de Ajuda', href: 'ajuda.html' },
            { text: 'Tutoriais', href: 'tutoriais.html' },
            { text: 'FAQ', href: 'faq.html' },
            { text: 'Contatar Suporte', href: 'suporte.html' }
        ];

        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.text;
            helpContent.appendChild(a);
        });

        // Substituir o ícone pelo dropdown
        const parentElement = icon.parentElement;
        dropdown.appendChild(icon.cloneNode(true));
        dropdown.appendChild(helpContent);

        parentElement.replaceChild(dropdown, icon);
    }

    // Exportação de dados
    const exportButtons = document.querySelectorAll('.btn-export');

    exportButtons.forEach(button => {
        button.addEventListener('click', function () {
            const format = this.getAttribute('data-format');
            const dataType = this.getAttribute('data-type');

            alert(`Exportando dados de ${dataType} no formato ${format}...`);
            // Aqui seria implementada a lógica real de exportação
        });
    });

    // Filtros de dados
    const filterButtons = document.querySelectorAll('.btn-filter');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filterInputs = document.querySelectorAll('.filter-input');
            let filterParams = {};

            filterInputs.forEach(input => {
                if (input.value) {
                    filterParams[input.getAttribute('name')] = input.value;
                }
            });

            // Aqui seria implementada a lógica real de filtragem com os parâmetros
            console.log('Filtros aplicados:', filterParams);
        });
    });

    // Inicializar todos os gráficos na página inicial
    initCharts();
});

// Função para inicializar gráficos se estiverem presentes na página
function initCharts() {
    // Verifica se Chart.js está disponível
    if (typeof Chart === 'undefined') return;

    // Inicializa apenas se houver canvas para gráficos na página
    const chartCanvases = document.querySelectorAll('canvas[id$="Chart"]');
    if (chartCanvases.length === 0) return;

    // O resto da inicialização dos gráficos será específico para cada página
    // e já está incluído no código HTML específico de cada página
} 