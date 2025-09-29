/**
 * Shared Office Components for Atomic CRM
 * Enhanced navigation, AI task bars, and automation features
 */

// Enhanced navigation bar component
const EnhancedNavigation = {
    create: function(officeName, officeIcon, officeDescription) {
        return `
        <!-- Enhanced Navigation Bar -->
        <nav class="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 p-4 mb-6 rounded-xl">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <button onclick="window.location.href='index.html'" 
                            class="enhanced-btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300">
                        ← Dashboard
                    </button>
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">${officeIcon}</div>
                        <div>
                            <h1 class="text-xl font-bold">${officeName}</h1>
                            <p class="text-xs text-gray-400">${officeDescription}</p>
                        </div>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <!-- Quick Office Navigation -->
                    <div class="hidden md:flex space-x-2">
                        <button onclick="navigateToOffice('ai-chatbot.html')" 
                                class="nav-office-btn" title="AI Assistant">🤖</button>
                        <button onclick="navigateToOffice('ceo-office.html')" 
                                class="nav-office-btn" title="CEO Office">💼</button>
                        <button onclick="navigateToOffice('accounts-office.html')" 
                                class="nav-office-btn" title="Accounts">📊</button>
                        <button onclick="navigateToOffice('it-office.html')" 
                                class="nav-office-btn" title="IT Support">💻</button>
                        <button onclick="navigateToOffice('scheduling-office.html')" 
                                class="nav-office-btn" title="Scheduling">📅</button>
                    </div>
                    <!-- Status Indicator -->
                    <div class="text-right">
                        <div class="text-sm font-bold text-green-400" id="officeStatus">Online</div>
                        <div class="text-xs text-gray-400">Office Status</div>
                    </div>
                </div>
            </div>
        </nav>
        `;
    }
};

// Animated AI Task Bar component
const AITaskBar = {
    create: function(officeName) {
        return `
        <!-- AI Task Bar -->
        <div class="ai-task-bar bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 mb-6 border border-gray-600">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="ai-pulse-indicator w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                        <h3 class="font-semibold text-sm">AI Assistant Active</h3>
                        <p class="text-xs text-gray-400">Ready to help with ${officeName} tasks</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="quickAIAction('create-task')" 
                            class="ai-quick-btn bg-blue-600/20 hover:bg-blue-600/40 px-3 py-1 rounded text-xs">
                        ✅ New Task
                    </button>
                    <button onclick="quickAIAction('get-summary')" 
                            class="ai-quick-btn bg-purple-600/20 hover:bg-purple-600/40 px-3 py-1 rounded text-xs">
                        📊 Summary
                    </button>
                    <button onclick="toggleAIChat()" 
                            class="ai-quick-btn bg-green-600/20 hover:bg-green-600/40 px-3 py-1 rounded text-xs">
                        💬 Chat
                    </button>
                </div>
            </div>
            
            <!-- Expandable AI Chat -->
            <div id="aiChatPanel" class="ai-chat-panel mt-4 hidden">
                <div class="bg-gray-900 rounded-lg p-4">
                    <div id="aiChatMessages" class="h-32 overflow-y-auto mb-3 text-sm">
                        <div class="text-blue-400 mb-2">
                            <strong>AI:</strong> Hello! I'm ready to help with ${officeName} tasks. What would you like to do?
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <input type="text" id="aiChatInput" 
                               placeholder="Ask AI for help..." 
                               class="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm"
                               onkeypress="handleAIChatEnter(event)">
                        <button onclick="sendAIMessage()" 
                                class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
};

// Live Tasks Widget component
const LiveTasksWidget = {
    create: function(officeName) {
        return `
        <!-- Live Tasks Widget -->
        <div class="live-tasks-widget bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 shadow-lg">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold flex items-center">
                    📋 Active Tasks
                    <span class="ml-2 bg-blue-600 text-xs px-2 py-1 rounded-full" id="taskCount">0</span>
                </h3>
                <button onclick="refreshTasks()" 
                        class="text-gray-400 hover:text-white transition-colors">
                    🔄
                </button>
            </div>
            
            <div id="tasksList" class="space-y-2 mb-4">
                <!-- Tasks will be loaded here -->
                <div class="animate-pulse">
                    <div class="bg-gray-600 h-4 rounded mb-2"></div>
                    <div class="bg-gray-600 h-4 rounded w-3/4"></div>
                </div>
            </div>
            
            <div class="flex gap-2">
                <button onclick="createNewTask()" 
                        class="flex-1 bg-green-600/20 hover:bg-green-600/40 border border-green-600/30 px-4 py-2 rounded text-sm transition-all">
                    ➕ New Task
                </button>
                <button onclick="viewAllTasks()" 
                        class="flex-1 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-600/30 px-4 py-2 rounded text-sm transition-all">
                    📋 View All
                </button>
            </div>
        </div>
        `;
    }
};

// Enhanced CSS styles for all components
const EnhancedStyles = `
<style>
    /* Enhanced Button Animations */
    .enhanced-btn {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    .enhanced-btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        transition: all 0.3s ease;
        transform: translate(-50%, -50%);
    }
    
    .enhanced-btn:hover::before {
        width: 300px;
        height: 300px;
    }
    
    /* Navigation Office Buttons */
    .nav-office-btn {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid rgba(75, 85, 99, 0.5);
        background: rgba(55, 65, 81, 0.5);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
    }
    
    .nav-office-btn:hover {
        background: rgba(59, 130, 246, 0.2);
        border-color: rgba(59, 130, 246, 0.5);
        transform: translateY(-2px);
    }
    
    /* AI Task Bar Animations */
    .ai-pulse-indicator {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    .ai-quick-btn {
        transition: all 0.3s ease;
        border: 1px solid transparent;
    }
    
    .ai-quick-btn:hover {
        transform: translateY(-1px);
        border-color: currentColor;
    }
    
    /* AI Chat Panel Animation */
    .ai-chat-panel {
        animation: slideDown 0.3s ease-out;
        max-height: 200px;
        transition: max-height 0.3s ease;
    }
    
    .ai-chat-panel.hidden {
        max-height: 0;
        overflow: hidden;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Live Tasks Widget */
    .task-item {
        animation: fadeInUp 0.3s ease-out;
        transition: all 0.3s ease;
    }
    
    .task-item:hover {
        transform: translateX(4px);
        background: rgba(55, 65, 81, 0.5);
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Notification System */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease-out;
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
</style>
`;

// Enhanced JavaScript functions for all components
const EnhancedScripts = `
<script>
    // Navigation functions
    function navigateToOffice(url) {
        showNotification('Navigating to office...', 'info');
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }
    
    // AI Task Bar functions
    let aiChatVisible = false;
    
    function toggleAIChat() {
        const panel = document.getElementById('aiChatPanel');
        aiChatVisible = !aiChatVisible;
        
        if (aiChatVisible) {
            panel.classList.remove('hidden');
            document.getElementById('aiChatInput').focus();
        } else {
            panel.classList.add('hidden');
        }
    }
    
    function quickAIAction(action) {
        const actions = {
            'create-task': 'Creating a new task for you...',
            'get-summary': 'Generating office summary...',
            'analyze-data': 'Analyzing office data...'
        };
        
        showNotification(actions[action] || 'Processing AI request...', 'info');
        
        // Simulate AI processing
        setTimeout(() => {
            if (action === 'create-task') {
                createNewTask();
            } else if (action === 'get-summary') {
                showAISummary();
            }
        }, 1500);
    }
    
    async function sendAIMessage() {
        const input = document.getElementById('aiChatInput');
        const messages = document.getElementById('aiChatMessages');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'text-right mb-2';
        userMsg.innerHTML = \`<span class="bg-blue-600 rounded px-2 py-1 text-sm">\${message}</span>\`;
        messages.appendChild(userMsg);
        
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
        
        // Show typing indicator
        const typingMsg = document.createElement('div');
        typingMsg.className = 'text-blue-400 mb-2';
        typingMsg.innerHTML = '<strong>AI:</strong> <em>Thinking...</em>';
        messages.appendChild(typingMsg);
        messages.scrollTop = messages.scrollHeight;
        
        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    office: document.title,
                    context: { officeName: document.title }
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                typingMsg.innerHTML = \`<strong>AI:</strong> \${data.data.response}\`;
            } else {
                throw new Error('AI service unavailable');
            }
        } catch (error) {
            typingMsg.innerHTML = '<strong>AI:</strong> Sorry, I encountered an error. Please try again.';
        }
        
        messages.scrollTop = messages.scrollHeight;
    }
    
    function handleAIChatEnter(event) {
        if (event.key === 'Enter') {
            sendAIMessage();
        }
    }
    
    // Tasks functions
    async function loadTasks() {
        const officeName = document.title.toLowerCase().replace(/\s+/g, '-');
        
        try {
            const response = await fetch(\`/api/tasks?office=\${officeName}&limit=5\`);
            if (response.ok) {
                const data = await response.json();
                displayTasks(data.data || []);
            }
        } catch (error) {
            console.error('Failed to load tasks:', error);
            displayTasks([]); // Show empty state
        }
    }
    
    function displayTasks(tasks) {
        const tasksList = document.getElementById('tasksList');
        const taskCount = document.getElementById('taskCount');
        
        if (!tasksList || !taskCount) return;
        
        taskCount.textContent = tasks.length;
        
        if (tasks.length === 0) {
            tasksList.innerHTML = '<div class="text-gray-400 text-sm text-center py-4">No active tasks</div>';
            return;
        }
        
        tasksList.innerHTML = tasks.map(task => \`
            <div class="task-item bg-gray-700/50 rounded-lg p-3 border-l-4 border-blue-500">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-sm">\${task.title}</div>
                        <div class="text-xs text-gray-400">\${task.status || 'pending'}</div>
                    </div>
                    <div class="text-xs text-gray-500">
                        \${new Date(task.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>
        \`).join('');
    }
    
    function refreshTasks() {
        showNotification('Refreshing tasks...', 'info');
        loadTasks();
    }
    
    function createNewTask() {
        const title = prompt('Enter task title:');
        if (!title) return;
        
        const officeName = document.title.toLowerCase().replace(/\s+/g, '-');
        
        fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                office: officeName,
                status: 'pending'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Task created successfully!', 'success');
                loadTasks();
            } else {
                showNotification('Failed to create task', 'error');
            }
        })
        .catch(() => {
            showNotification('Failed to create task', 'error');
        });
    }
    
    function viewAllTasks() {
        navigateToOffice('task-archive.html');
    }
    
    function showAISummary() {
        const summary = \`
            <div class="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-4">
                <h4 class="font-bold text-blue-400 mb-2">📊 Office Summary</h4>
                <ul class="text-sm space-y-1">
                    <li>• Active tasks: \${document.getElementById('taskCount').textContent}</li>
                    <li>• Office status: Online</li>
                    <li>• Last activity: Just now</li>
                    <li>• AI assistant: Ready</li>
                </ul>
            </div>
        \`;
        
        const messages = document.getElementById('aiChatMessages');
        if (messages) {
            messages.innerHTML += summary;
            messages.scrollTop = messages.scrollHeight;
        }
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = \`notification \${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white\`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Initialize components when page loads
    document.addEventListener('DOMContentLoaded', function() {
        // Load tasks if widget exists
        if (document.getElementById('tasksList')) {
            loadTasks();
        }
        
        // Update office status
        if (document.getElementById('officeStatus')) {
            document.getElementById('officeStatus').textContent = 'Online';
        }
        
        // Initialize any other components
        console.log('Atomic CRM office components initialized');
    });
</script>
`;

// Export all components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EnhancedNavigation,
        AITaskBar,
        LiveTasksWidget,
        EnhancedStyles,
        EnhancedScripts
    };
} else if (typeof window !== 'undefined') {
    window.AtomicCRMComponents = {
        EnhancedNavigation,
        AITaskBar,
        LiveTasksWidget,
        EnhancedStyles,
        EnhancedScripts
    };
}