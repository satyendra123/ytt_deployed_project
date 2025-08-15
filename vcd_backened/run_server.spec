# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['run_server.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=['authentication', 'authentication.apps', 'authentication.urls', 'accounts', 'accounts.apps', 'accounts.urls', 'controller', 'controller.apps', 'controller.urls', 'dashboard', 'dashboard.apps', 'dashboard.urls', 'dj_rest_auth', 'dj_rest_auth.registration', 'allauth', 'allauth.account', 'allauth.socialaccount', 'rest_framework'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='run_server',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
