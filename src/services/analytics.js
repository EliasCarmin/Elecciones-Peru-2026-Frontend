const API_URL = 'https://elecciones-per--2026-backend-622135274332.us-central1.run.app/api/v1/analytics';

// Helper to generate SHA-256 hash
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate fingerprint based on: User-Agent + Timezone + Screen Resolution + Language
async function generateFingerprint() {
    try {
        const components = [
            navigator.userAgent,
            Intl.DateTimeFormat().resolvedOptions().timeZone,
            `${window.screen.width}x${window.screen.height}`,
            navigator.language
        ];
        return await sha256(components.join('|'));
    } catch (e) {
        console.error('Fingerprint generation failed', e);
        return 'unknown_fingerprint';
    }
}

let currentSessionId = localStorage.getItem('peru2026_session_id');

export const analytics = {
    async initSession() {
        if (currentSessionId) return; // Session already exists

        try {
            const fingerprint = await generateFingerprint();

            const payload = {
                fingerprint_hash: fingerprint,
                device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                referrer: document.referrer || null,
                city: null, // Optional: could be filled if we had geo-ip service
                country: null
            };

            const response = await fetch(`${API_URL}/session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                currentSessionId = data.session_id;
                localStorage.setItem('peru2026_session_id', currentSessionId);
                console.log('Session initialized:', currentSessionId);
            } else {
                console.warn('Failed to init session:', await response.text());
            }
        } catch (error) {
            console.error('Analytics init error:', error);
        }
    },

    async trackEvent(eventType, eventName, urlPath, entityId = null, metadata = {}) {
        if (!currentSessionId) {
            // Try to init session if missing, but don't block
            await this.initSession();
            if (!currentSessionId) return;
        }

        try {
            const payload = {
                session_id: currentSessionId,
                event_type: eventType,
                event_name: eventName,
                url_path: urlPath || window.location.pathname,
                entity_id: entityId,
                metadata: metadata
            };

            // Non-blocking fire-and-forget
            fetch(`${API_URL}/event`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(e => console.error('Track event failed', e));

        } catch (error) {
            console.error('Tracking error:', error);
        }
    }
};
