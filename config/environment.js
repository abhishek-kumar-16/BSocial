const development={
    name:'development',
    asset_path: './assets',
    session_cookie_key:'blasomething',
    db: 'codeial_development',
    google_client_id:"126515833419-qh21tuvhfj5u2t39v85lnvqb48jlegqr.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
}

const production={
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key:'efrQLQiMCWLxfrka3ij8GfH0TodDSTFI',
    db: 'codeial_development',
    google_client_id:"126515833419-qh21tuvhfj5u2t39v85lnvqb48jlegqr.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://codeial.com/users/auth/google/callback",
    jwt_secret: 'bdBXIDbUQPRm1F7Drww9MhkgF0rpy1yD',
}

module.exports= development;