// 認証システム
const users = {
    'basic001': { password: 'basic123', plan: 'basic', name: 'ベーシック会員' },
    'premium001': { password: 'premium456', plan: 'premium', name: 'プレミアム会員' },
    'vip001': { password: 'vip789', plan: 'vip', name: 'VIP会員' },
    // テスト用アカウント
    'Admin': { password: 'Admin', plan: 'vip', name: '管理者' },
    'Basic': { password: 'Admin', plan: 'basic', name: 'テストベーシック' },
    'Premium': { password: 'Admin', plan: 'premium', name: 'テストプレミアム' },
    'VIP': { password: 'Admin', plan: 'vip', name: 'テストVIP' }
};

// ローカルストレージキー
const AUTH_KEY = 'memberAuth';

// ログイン処理
document.addEventListener('DOMContentLoaded', function() {
    // 既にログインしているかチェック
    const currentUser = getCurrentUser();
    if (currentUser && window.location.pathname.includes('index.html')) {
        redirectToMemberPage(currentUser.plan);
        return;
    }

    const loginForm = document.getElementById('loginFormElement');
    const loginVideo = document.getElementById('loginVideo');
    
    // 動画を最初のフレームで停止
    if (loginVideo) {
        loginVideo.currentTime = 0;
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // 認証チェック
    if (users[username] && users[username].password === password) {
        // ログイン成功
        const userInfo = {
            username: username,
            plan: users[username].plan,
            name: users[username].name,
            loginTime: new Date().toISOString()
        };
        
        // セッション保存
        localStorage.setItem(AUTH_KEY, JSON.stringify(userInfo));
        
        // フォームをフェードアウト
        const loginFormContainer = document.getElementById('loginForm');
        if (loginFormContainer) {
            loginFormContainer.classList.add('fade-out');
        }
        
        // ログインアニメーション開始
        startLoginAnimation();
        
        // 8秒後にページ遷移
        setTimeout(() => {
            redirectToMemberPage(userInfo.plan);
        }, 8000);
        
    } else {
        // ログイン失敗
        errorMessage.textContent = 'ユーザーIDまたはパスワードが正しくありません';
        errorMessage.style.display = 'block';
        
        // 3秒後にエラーメッセージを非表示
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
}

function startLoginAnimation() {
    const loginVideo = document.getElementById('loginVideo');
    const videoOverlay = document.getElementById('videoOverlay');
    
    // ぼかしを解除してクリアな動画にする
    if (loginVideo) {
        loginVideo.classList.add('clear');
        loginVideo.play().catch(error => {
            console.log('動画の再生がブロックされました:', error);
        });
    }
    
    // 6秒後にダークアウト開始
    setTimeout(() => {
        if (videoOverlay) {
            videoOverlay.classList.add('darkout');
        }
    }, 6000);
    
    // 8秒後にページ遷移
    setTimeout(() => {
        // 遷移前に動画を停止
        if (loginVideo) {
            loginVideo.pause();
        }
    }, 8000);
}

function redirectToMemberPage(plan) {
    switch(plan) {
        case 'basic':
            window.location.href = 'basic.html';
            break;
        case 'premium':
            window.location.href = 'premium.html';
            break;
        case 'vip':
            window.location.href = 'vip.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

// 現在のユーザー情報を取得
function getCurrentUser() {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
        try {
            return JSON.parse(authData);
        } catch(e) {
            localStorage.removeItem(AUTH_KEY);
        }
    }
    return null;
}

// ログアウト処理
function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'index.html';
}

// ページアクセス制御
function checkAuth(requiredPlan) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    
    // プラン階層チェック
    const planLevels = { 'basic': 1, 'premium': 2, 'vip': 3 };
    const userLevel = planLevels[currentUser.plan] || 0;
    const requiredLevel = planLevels[requiredPlan] || 0;
    
    if (userLevel < requiredLevel) {
        alert('このページにアクセスする権限がありません。');
        redirectToMemberPage(currentUser.plan);
        return false;
    }
    
    return currentUser;
}

// ページ初期化
function initializePage(requiredPlan) {
    const user = checkAuth(requiredPlan);
    if (user) {
        updateUserInfo(user);
        return user;
    }
    return null;
}

function updateUserInfo(user) {
    const userInfoElement = document.querySelector('.user-info');
    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <span>${user.name}</span>
            <small>(${user.username})</small>
        `;
    }
}

// サービス情報定義
const services = {
    clinic: {
        title: 'クリニック サブスク案件',
        description: '30％バック保証のクリニック関連サブスクリプション案件',
        minPlan: 'basic'
    },
    clinicOwner: {
        title: 'クリニックオーナー権',
        description: 'クリニック経営権の取得・運営サポート',
        minPlan: 'premium'
    },
    operation: {
        title: '運用サービス',
        description: '資産運用・投資運用の専門サポート',
        minPlan: 'basic'
    },
    bReturn: {
        title: 'B戻しサービス',
        description: '特別リターンプログラム',
        minPlan: 'premium'
    },
    overseasCorp: {
        title: '海外法人オーナー権',
        description: '海外法人設立・運営権の取得',
        minPlan: 'vip'
    },
    painting30: {
        title: '絵画 - 30号（660万円）',
        description: '池内さんの絵 2年待ち 10日仕入れ',
        minPlan: 'premium'
    },
    painting50: {
        title: '絵画 - 50号（1000万円）',
        description: '池内さんの絵 2年待ち 10日仕入れ',
        minPlan: 'premium'
    },
    painting100: {
        title: '絵画 - 100号（2000万円）',
        description: '池内さんの絵 2年待ち 10日仕入れ',
        minPlan: 'vip'
    },
    travelPolicy: {
        title: '旅費規定 ポイントマイル還元',
        description: '出張・旅行での最大ポイント還元システム',
        minPlan: 'basic'
    },
    luxuryCar: {
        title: '高級レンタカー',
        description: 'プレミアム車両の優待レンタルサービス',
        minPlan: 'premium'
    },
    alphard: {
        title: '運転手付きアルファード',
        description: '専属運転手付きプレミアム送迎サービス',
        minPlan: 'vip'
    },
    secretary: {
        title: '秘書サービス',
        description: '個人秘書・アシスタントサービス',
        minPlan: 'vip'
    },
    investment: {
        title: '毎月積立投資案件リターン',
        description: '安定した月次リターンを目指す投資プログラム',
        minPlan: 'basic'
    }
};

// サービス表示
function displayServices(userPlan, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const planLevels = { 'basic': 1, 'premium': 2, 'vip': 3 };
    const userLevel = planLevels[userPlan] || 0;

    const availableServices = Object.entries(services).filter(([key, service]) => {
        const requiredLevel = planLevels[service.minPlan] || 0;
        return userLevel >= requiredLevel;
    });

    container.innerHTML = availableServices.map(([key, service]) => {
        const planClass = service.minPlan === 'vip' ? 'vip' : service.minPlan === 'premium' ? 'premium' : 'basic';
        return `
            <div class="service-card ${planClass}">
                <div class="plan-badge ${service.minPlan}">${service.minPlan.toUpperCase()}</div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            </div>
        `;
    }).join('');
}