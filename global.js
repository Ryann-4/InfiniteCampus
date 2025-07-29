window.addEventListener('DOMContentLoaded', () => {
    const colorInput        = document.getElementById('colorInput');
    const themeSelector     = document.getElementById('themeSelector');
    const resetBtn          = document.getElementById('resetColors');
    const header            = document.getElementById('site-header');
    const footer            = document.getElementById('site-footer');
    const textOnlyFooter    = document.getElementById('text-only-footer');
    const globalText        = document.getElementById('global-text');
    const gradLeftInput     = document.getElementById('gradientLeft');
    const gradRightInput    = document.getElementById('gradientRight');
    const testElements      = document.querySelectorAll('.test');
    const RGB_VIDEO_URL     = "https://codehs.com/uploads/9ea5f20a2d618622de3030832cde8ef6";
    const isDarkColor = hex => {
        if (!hex || hex.length !== 7 || !hex.startsWith('#')) return false;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 < 128;
    };
    function insertRGBVideoBackground(target) {
        const existing = target?.querySelector('.rgb-video-bg');
        if (existing) existing.remove();
        const video = document.createElement('video');
        video.src = RGB_VIDEO_URL;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.className = 'rgb-video-bg';
        Object.assign(video.style, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: '-1',
            pointerEvents: 'none'
        });
        target.style.position = 'fixed';
        target.prepend(video);
    }
    function clearRGBVideo(target) {
        const vid = target?.querySelector('.rgb-video-bg');
        if (vid) vid.remove();
    }
    function applyTheme(colOrLeft, gradientSetting = null) {
        let bg = colOrLeft;
        let isDark = isDarkColor(colOrLeft);
        if (gradientSetting === 'custom') {
            const l = localStorage.getItem('gradientLeft')  || '#ffffff';
            const r = localStorage.getItem('gradientRight') || '#000000';
            bg = `linear-gradient(to right, ${l}, ${r})`;
            isDark = isDarkColor(l) || isDarkColor(r);
            clearRGBVideo(header); 
            clearRGBVideo(footer);
        } else if (gradientSetting) {
            clearRGBVideo(header); 
            clearRGBVideo(footer);
            if (gradientSetting === 'red') {
                bg = 'linear-gradient(to right, darkred, black)';
                isDark = true;
            } else if (gradientSetting === 'green') {
                bg = 'linear-gradient(to right, #8cbe37, black)';
                isDark = true;
            } else if (gradientSetting === 'sunset') {
                bg = 'linear-gradient(to right, yellow, brown)';
                isDark = false;
            } else if (gradientSetting === 'reversered') {
                bg = 'linear-gradient(to right, black, darkred)';
                isDark = true;
            } else if (gradientSetting === 'reversegreen') {
                bg = 'linear-gradient(to right, black, #8cbe37)';
                isDark = true;
            } else if (gradientSetting === 'reversesunset') {
                bg = 'linear-gradient(to right, brown, yellow)';
                isDark = false;
            } else if (gradientSetting === 'bty') {
                bg = 'linear-gradient(to right, #37A7BE, #8cbe37, yellow)';
                isDark = false;
            } else if (gradientSetting === 'btg') {
                bg = 'linear-gradient(to right, black, gold)';
                isDark = true;
            } else if (gradientSetting === 'lights') {
                bg = 'linear-gradient(234deg, black,darkgrey,grey,brown,maroon,salmon,darkred,red,black,black,black,black,black,black,black,black,black,black,black,black,black,blue,orange,blue,black,black,black,black,black,black,black,black,black,black,darkgreen,green,lime,#7FFF00,yellow,#FFAE42,orange,#FFAE42,yellow,#7FFF00,lime,green,darkgreen,black,black, gold,brown,gold,black,black,black,black,black,black,black)';
                isDark = true;
            } else if (gradientSetting === 'bld') {
                bg = 'linear-gradient(to bottom, black,grey,white,black,black,black,black,black,black,black,black,black,white, grey,black)';
                isDark = true;
            } else if (gradientSetting === 'gsaber') {
                bg = 'linear-gradient(to bottom, transparent, #004000, #008000, #00BF00, #00FF00,#80FF00,#C0FF00,#E0FF00,white,white,white,white,white,white,white,white,white,white,white,white,white,white,white,#E0FF00,#C0FF00,#80FF00,#00FF00,#008F00,#008000,#004000,transparent)';
                isDark = false;
            } else if (gradientSetting === 'rsaber') {
                bg = 'linear-gradient(to bottom,transparent,#330000,#660000,#990000,#CC0000,red,red,#FF3333,white,white,white,white,white,white,white,white,white,white,white,white,white,white,#FF3333,red,red,#CC0000,#990000,#660000,#330000,transparent)';
                isDark = false;
            } else if (gradientSetting === 'bsaber') {
                bg = 'linear-gradient(to bottom, transparent,#011926,#011926,#003E5C,#003E5C,#003A6B,#5880A2,#83A3BE,#AFC6D9,#DBE9F5,white,white,white,white,white,white,white,white,white,white,white,white,white,white,white,#DBE9F5,#AFC6D9,#83A3BE,#5880A2,#003A6B,#003E5C,#003E5C,#011926,#011926,transparent)';
                isDark = false;
            } else if (gradientSetting === 'psaber') {
                bg = 'linear-gradient(to bottom, transparent,#1B1B1B,#2A1E36,#3A2152,#49236D,#582688,purple,#D8BFD8,#D4C0D9,#F0F0FF,white,white,white,white,white,white,white,white,white,white,white,white,white,white,white,#F0F0FF,#D4C0D9,#D8BFD8,purple,#582688,#49236D,#3A2152,#2A1E36,#1B1B1B,transparent)';
                isDark = false;
            } else if (gradientSetting === 'trans') {
                bg = 'linear-gradient(to bottom,black,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,black)';
                isDark = true;
            } else if (gradientSetting === 'drk') {
                bg = 'linear-gradient(to right, black, black)';
                isDark = true;
            } else if (gradientSetting === 'lit') {
                bg = 'linear-gradient(to right, rgb(214,214,214), rgb(214,214,214))';
                isDark= false;
            } else if (gradientSetting === 'mnb') {
                bg = 'linear-gradient(to right, darkblue, black)';
                isDark = true;
            } else if (gradientSetting === 'rgb') {
                if (header) insertRGBVideoBackground(header);
                if (footer) insertRGBVideoBackground(footer);
                bg = 'transparent';
                isDark = false;
            }
        }
        const textColor = isDark ? 'white' : '';
        localStorage.setItem('globalDarkTheme', isDark);
        localStorage.setItem('globalTextColor', textColor);
        [header, footer].forEach(bar => {
            if (!bar) return;
            bar.style.background = bg;
            bar.style.color = textColor;
            bar.style.borderColor = 'white';
            bar.querySelectorAll('a, span, div, p').forEach(e => {
                e.style.color = textColor || '';
                e.style.borderColor = textColor || '';
            });
            bar.querySelectorAll('img').forEach(img => {
                img.style.filter = isDark ? 'invert(1)' : '';
            });
            if (!isDark && bar === header) {
                bar.querySelectorAll('button').forEach(btn => {
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.style.border = '';
                });
            }
            if (!isDark && bar === footer) {
                bar.querySelectorAll('p, span, div').forEach(el => {
                    el.style.color = '';
                });
            }
            document.querySelectorAll('.settings').forEach(img => {
                img.style.filter = isDark ? 'invert(0)' : 'invert(1)';
            });
            document.querySelectorAll('.settings-button').forEach(div => {
                div.style.border = isDark ? '1px solid white' : '1px solid black';
            });
        });
        if (header && testElements.length > 0) {
            const headerBg = window.getComputedStyle(header).background;
            testElements.forEach(el => el.style.background = headerBg);
        }
        textOnlyFooter && (textOnlyFooter.style.color = textColor || '');
        globalText && (globalText.style.color = textColor || '');
        if (colorInput) {
            colorInput.style.backgroundColor = colOrLeft;
            colorInput.style.color = textColor;
            if (parseFloat(getComputedStyle(colorInput).borderWidth) > 0)
                colorInput.style.borderColor = textColor;
        }
    }
    const storedTheme = localStorage.getItem('useGradient');
    const storedFlat  = localStorage.getItem('headerColor');
    const storedLeft  = localStorage.getItem('gradientLeft');
    const storedRight = localStorage.getItem('gradientRight');
    if (storedTheme && storedTheme !== 'custom') {
        if (themeSelector) themeSelector.value = storedTheme;
        applyTheme('#000000', storedTheme);
    } else if (storedTheme === 'custom' && storedLeft && storedRight) {
        if (gradLeftInput) gradLeftInput.value = storedLeft;
        if (gradRightInput) gradRightInput.value = storedRight;
        applyTheme(storedLeft, 'custom');
    } else if (storedFlat) {
        if (colorInput) colorInput.value = storedFlat;
        applyTheme(storedFlat);
    } else {
        applyTheme('#8cbe37');
    }
    colorInput?.addEventListener('input', () => {
        localStorage.setItem('headerColor', colorInput.value);
        ['gradientLeft', 'gradientRight', 'useGradient'].forEach(k => localStorage.removeItem(k));
        if (themeSelector) themeSelector.value = '';
        applyTheme(colorInput.value);
    });
    [gradLeftInput, gradRightInput].forEach(inp => inp?.addEventListener('input', () => {
        if (themeSelector?.value) return;
        const l = gradLeftInput?.value || '#ffffff';
        const r = gradRightInput?.value || '#000000';
        localStorage.setItem('gradientLeft', l);
        localStorage.setItem('gradientRight', r);
        localStorage.setItem('useGradient', 'custom');
        localStorage.removeItem('headerColor');
        applyTheme(l, 'custom');
    }));
    themeSelector?.addEventListener('change', () => {
        const sel = themeSelector.value;
        if (!sel) {
            const l = localStorage.getItem('gradientLeft');
            const r = localStorage.getItem('gradientRight');
            if (l && r) applyTheme(l, 'custom');
            else if (colorInput?.value) applyTheme(colorInput.value);
            return;
        }
        ['gradientLeft', 'gradientRight', 'headerColor'].forEach(k => localStorage.removeItem(k));
        localStorage.setItem('useGradient', sel);
        applyTheme('#000000', sel);
        location.reload();
    });
    resetBtn?.addEventListener('click', () => {
        ['headerColor', 'useGradient', 'gradientLeft', 'gradientRight', 'globalTextColor', 'globalDarkTheme']
        .forEach(k => localStorage.removeItem(k));
        if (themeSelector) themeSelector.value = '';
        const defaultColor = '#8cbe37';
        if (colorInput) colorInput.value = defaultColor;
        if (gradLeftInput) gradLeftInput.value = defaultColor;
        if (gradRightInput) gradRightInput.value = defaultColor;
        clearRGBVideo(header);
        clearRGBVideo(footer);
        applyTheme(defaultColor);
        location.reload();
    });
});