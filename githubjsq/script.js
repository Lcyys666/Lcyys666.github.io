// 节点列表
const nodes = [
    { name: 'gh.llkk.cc', url: 'https://gh.llkk.cc' },
    { name: 'github.moeyy.xyz', url: 'https://github.moeyy.xyz' },
    { name: 'ghproxy.cn', url: 'https://ghproxy.cn' },
    { name: 'ghproxy.net', url: 'https://ghproxy.net' },
    { name: 'gitproxy.click', url: 'https://gitproxy.click' },
    { name: 'github.tbedu.top', url: 'https://github.tbedu.top' },
];

// 当前主题
let currentTheme = 'light-theme';

// 根据系统主题设置初始主题
function setInitialTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.className = 'dark-theme';
        currentTheme = 'dark-theme';
    } else {
        document.body.className = 'light-theme';
        currentTheme = 'light-theme';
    }
}

// 切换主题
function toggleTheme() {
    currentTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    document.body.className = currentTheme;
}

// 初始化节点列表
function initializeNodeList() {
    const nodeStatusList = document.getElementById('nodeStatusList');
    nodeStatusList.innerHTML = '';
    nodes.forEach(node => {
        const nodeItem = document.createElement('div');
        nodeItem.className = 'node-item';
        nodeItem.setAttribute('data-name', node.name);
        nodeItem.innerHTML = `
            <span class="node-name">${node.name}</span>
            <span class="node-url">${node.url}</span>
            <span class="status">--</span>
            <span class="recommendation">--</span>
        `;
        nodeStatusList.appendChild(nodeItem);
    });
}

// 检测节点延迟并排序
function detectNodeLatency() {
    const nodeStatusList = document.getElementById('nodeStatusList');
    nodes.forEach(node => {
        const nodeItem = document.querySelector(`.node-item[data-name="${node.name}"]`);
        nodeItem.querySelector('.status').textContent = '检测中';
        nodeItem.querySelector('.recommendation').textContent = '检测中';

        const startTime = Date.now();
        const img = new Image();
        img.src = `${node.url}/favicon.ico`;
        img.onload = function() {
            const latency = Date.now() - startTime;
            nodeItem.querySelector('.status').textContent = `${latency}ms`;
            nodeItem.querySelector('.recommendation').textContent = calculateRecommendation(latency);
        };
        img.onerror = function() {
            const latency = Date.now() - startTime;
            nodeItem.querySelector('.status').textContent = `${latency}ms`;
            nodeItem.querySelector('.recommendation').textContent = '不推荐';
        };
        img.ontimeout = function() {
            nodeItem.querySelector('.status').textContent = '超时';
            nodeItem.querySelector('.recommendation').textContent = '不推荐';
        };
        img.timeout = 5000; // 设置超时时间为5秒
    });
}

// 计算推荐指数
function calculateRecommendation(latency) {
    if (latency < 100) {
        return '非常推荐';
    } else if (latency < 300) {
        return '推荐';
    } else if (latency < 500) {
        return '一般';
    } else if (latency < 1000) {
        return '不推荐';
    } else {
        return '非常不推荐';
    }
}

// 下载文件
function downloadFile() {
    const githubLink = document.getElementById('githubLink').value;
    const selectedNode = document.getElementById('nodeSelector').value;

    if (!githubLink || !selectedNode) {
        alert('请输入 GitHub 文件链接并选择一个节点！');
        return;
    }

    // 确保链接拼接时只有一个 /
    const proxyUrl = `${selectedNode}${githubLink.startsWith('/') ? '' : '/'}${githubLink}`;
    window.open(proxyUrl, '_blank');
}

// 备份节点
function backupNodes() {
    const backupData = {
        nodes: nodes.map(node => ({
            name: node.name,
            url: node.url
        }))
    };
    localStorage.setItem('githubProxyBackup', JSON.stringify(backupData));
    alert('节点备份成功！');
}

// 恢复节点
function restoreNodes() {
    const backupData = JSON.parse(localStorage.getItem('githubProxyBackup'));
    if (backupData) {
        nodes.splice(0, nodes.length, ...backupData.nodes);
        initializeNodeList();
        alert('节点恢复成功！');
    } else {
        alert('没有备份数据！');
    }
}

// 初始化主题
setInitialTheme();

// 初始化节点列表
initializeNodeList();

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (event.matches) {
        document.body.className = 'dark-theme';
        currentTheme = 'dark-theme';
    } else {
        document.body.className = 'light-theme';
        currentTheme = 'light-theme';
    }
});