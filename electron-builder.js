return {
    "appId": "com.triwiboworidhopermana19.tiktok_tts",
    "productName": "TikTok Text to Speech",
    "copyright": "",
    "files": [
        "package.json",
        "app/**/*",
        "node_modules"
    ],
    "dmg": {
        "background": null,
        "backgroundColor": "#ffffff",
        "window": {
            "width": "400",
            "height": "300"
        },
        "contents": [
            {
                "x": 100,
                "y": 100
            },
            {
                "x": 300,
                "y": 100,
                "type": "link",
                "path": "/Applications"
            }
        ]
    },
    "mac": {
        "target": "dmg",
        "category": "public.app-category.utilities"
    },
    "win": {
        "target": "nsis"
    },
    "linux": {
        "target": "AppImage",
        "category": "Utility"
    }
}