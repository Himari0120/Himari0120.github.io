
/* =====================================
   おトク発見ナビ 運営者コンソール
   auth.js
===================================== */

/*
 * 運営者認証管理
 *
 * 現段階では認証サーバー未接続です。
 * 安全のため、認証が確認できない場合は
 * 管理画面を利用できない状態にします。
 *
 * ※ブラウザ内だけのパスワード認証は
 *   安全な認証として使用しません。
 */

let authCallbacks = {
  onLogin: null,
  onLogout: null
};

let initialized = false;

export const initializeAuth = {

  async initialize(callbacks = {}) {
    authCallbacks = {
      onLogin: callbacks.onLogin || null,
      onLogout: callbacks.onLogout || null
    };

    initialized = true;

    // 認証サーバーが未接続のため、
    // ログイン済みとは判定しません。
    if (typeof authCallbacks.onLogout === "function") {
      authCallbacks.onLogout();
    }

    console.info(
      "運営者認証：認証サーバー未接続"
    );

    return {
      authenticated: false,
      status: "AUTH_SERVER_NOT_CONNECTED"
    };
  },

  async logout() {
    if (!initialized) return;

    // サーバー側のログアウト処理は
    // 認証サーバー接続時に実装します。

    if (typeof authCallbacks.onLogout === "function") {
      authCallbacks.onLogout();
    }

    return {
      success: true,
      status: "LOCAL_SESSION_CLEARED"
    };
  },

  isAuthenticated() {
    // サーバー認証が実装されるまでは
    // 常に未認証として扱います。
    return false;
  }

};
