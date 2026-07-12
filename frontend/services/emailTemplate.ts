// Beautiful client-side HTML Email template builder for Resend
export function generateClientHtmlTemplate(type: string, userDisplayName: string, details: any): string {
  const primaryColor = "#4f46e5";
  const accentColor = "#a78bfa";
  const darkBg = "#050505";
  const panelBg = "#0e0e11";
  const textColor = "#d1d5db";
  const white = "#ffffff";

  const emailHeader = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Aura Intelligence</title>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: ${darkBg}; color: ${textColor}; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 40px auto; padding: 0; background-color: ${panelBg}; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.05); overflow: hidden; }
        .header-gradient { background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .logo-text { font-size: 20px; font-weight: 800; letter-spacing: 2px; color: ${white}; margin: 0; text-transform: uppercase; }
        .logo-sub { font-size: 10px; color: ${accentColor}; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
        .content-body { padding: 32px 24px; }
        .greeting { font-size: 18px; font-weight: 700; color: ${white}; margin-bottom: 12px; }
        .paragraph { font-size: 14px; line-height: 1.6; color: ${textColor}; margin: 0 0 20px 0; }
        .card { background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 16px; padding: 20px; margin-bottom: 24px; }
        .card-title { font-size: 13px; font-weight: bold; text-transform: uppercase; color: ${accentColor}; margin: 0 0 12px 0; letter-spacing: 1px; }
        .stat-grid { display: table; width: 100%; margin-bottom: 12px; }
        .stat-col { display: table-cell; width: 33.33%; text-align: center; padding: 10px 0; }
        .stat-val { font-size: 24px; font-weight: 800; color: ${white}; margin: 0; }
        .stat-lbl { font-size: 10px; text-transform: uppercase; color: #9ca3af; margin: 4px 0 0 0; letter-spacing: 1px; }
        .action-btn { display: inline-block; background: linear-gradient(to right, ${primaryColor}, ${accentColor}); color: ${white} !important; text-decoration: none; padding: 14px 28px; font-size: 13px; font-weight: bold; border-radius: 12px; margin: 10px 0 20px 0; text-align: center; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2); }
        .footer { text-align: center; padding: 32px 24px; border-top: 1px solid rgba(255, 255, 255, 0.05); background-color: rgba(0,0,0,0.2); }
        .social-links { margin-bottom: 16px; }
        .social-icon { display: inline-block; color: ${accentColor}; text-decoration: none; margin: 0 12px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .footer-text { font-size: 11px; color: #6b7280; line-height: 1.5; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header-gradient">
          <div class="logo-text">AURA ATHLETIC OS</div>
          <div class="logo-sub">INTELLIGENT PHYSIOLOGICAL SYSTEMS</div>
        </div>
        <div class="content-body">
  `;

  const emailFooter = `
        </div>
        <div class="footer">
          <div class="social-links">
            <a href="#" class="social-icon">Dashboard</a>
            <a href="#" class="social-icon">Expert Coach</a>
            <a href="#" class="social-icon">Support</a>
          </div>
          <p class="footer-text">
            © 2026 Aura Intelligent Athletic Platforms Inc.
          </p>
          <p class="footer-text" style="margin-top: 6px;">
            This transmission is auto-generated based on high-integrity tracking matrices. You can modify notification rules inside the Security Dashboard settings.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (type === 'welcome') {
    return `
      ${emailHeader}
      <div class="greeting">Welcome to the Matrix, Athlete ${userDisplayName}</div>
      <p class="paragraph">
        You have successfully initialized your profile with **Aura Athletic OS v3.5**. We build highly engineered bio-tracking pipelines to convert thermodynamic and training inputs into pristine athletic outcomes.
      </p>
      
      <div class="card">
        <div class="card-title">YOUR POWER SUITE PATHWAY</div>
        <p class="paragraph" style="font-size: 13px; margin-bottom: 10px;">
          ⚡ **AI Workout Builder**: Structured metabolic split creation.
        </p>
        <p class="paragraph" style="font-size: 13px; margin-bottom: 10px;">
          🍳 **Meal Vision Scanner**: Multi-stage visual nutrition breakdown.
        </p>
        <p class="paragraph" style="font-size: 13px; margin-bottom: 0;">
          🧠 **AI Expert Coach**: Dynamic interactive sports nutrition analysis.
        </p>
      </div>

      <center>
        <a href="#" class="action-btn">ACCESS MY DASHBOARD</a>
      </center>
      ${emailFooter}
    `;
  }

  if (type === 'workout_started') {
    return `
      ${emailHeader}
      <div class="greeting">Training Protocol Call: Peak Power Awaits</div>
      <p class="paragraph">
        Greetings ${userDisplayName}. Your scheduled daily workout threshold is approaching. High-integrity consistent microcycles are the cornerstone of athletic evolution.
      </p>

      <div class="card">
        <div class="card-title">SCHEDULED SESSION DETAILS</div>
        <div style="font-size: 15px; font-weight: bold; color: #ffffff; margin-bottom: 8px;">🏋️ ${details?.workoutName || 'Hypertrophy Push Splits'}</div>
        <div style="font-size: 13px; color: #a78bfa; margin-bottom: 12px;">Duration Target: 45 Mins | Intensity: Moderate-High</div>
        <p class="paragraph" style="font-size: 13px; margin: 0;">
          Focus today is clean eccentric muscle control, strict compound press movements, and staying hydrated.
        </p>
      </div>

      <center>
        <a href="#" class="action-btn">LAUNCH TRAINING HUD</a>
      </center>
      ${emailFooter}
    `;
  }

  if (type === 'workout_completed') {
    return `
      ${emailHeader}
      <div class="greeting">Workout Logged: Clean Kinetic Release</div>
      <p class="paragraph">
        Superb execution, <strong>${userDisplayName}</strong>! You have successfully concluded your active training protocol and stored your workout payload.
      </p>

      <div class="card">
        <div class="card-title">SESSION LOG SUMMARY</div>
        <div style="font-size: 15px; font-weight: bold; color: #ffffff; margin-bottom: 4px;">🏋️ ${details?.workoutName || 'Hypertrophy Power Split'}</div>
        <div style="font-size: 12px; color: #a78bfa; margin-bottom: 16px;">Category: ${details?.category || 'Strength'} | Date: ${details?.workoutDate || '2026-07-11'}</div>
        
        <div class="stat-grid" style="margin-bottom: 16px;">
          <div class="stat-col">
            <div class="stat-val" style="color: #f43f5e;">${details?.caloriesBurned || details?.calories || '520'}</div>
            <div class="stat-lbl">CAL BURNT</div>
          </div>
          <div class="stat-col" style="border-left: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05);">
            <div class="stat-val" style="color: #6366f1;">${details?.duration || '42'}</div>
            <div class="stat-lbl">MINUTES</div>
          </div>
          <div class="stat-col">
            <div class="stat-val" style="color: #10b981;">🔥 ${details?.streak || '14'}</div>
            <div class="stat-lbl">DAY STREAK</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">OVERALL METRIC ACCUMULATION</div>
        <div class="stat-grid">
          <div class="stat-col" style="width: 50%;">
            <div class="stat-val" style="font-size: 20px;">${details?.totalCompleted || '18'}</div>
            <div class="stat-lbl">TOTAL WORKOUTS</div>
          </div>
          <div class="stat-col" style="border-left: 1px solid rgba(255,255,255,0.05); width: 50%;">
            <div class="stat-val" style="font-size: 20px; color: #f59e0b;">${details?.totalCalories || '9,820'}</div>
            <div class="stat-lbl">TOTAL CALORIES</div>
          </div>
        </div>
      </div>
      ${emailFooter}
    `;
  }

  // Fallback / default
  return `
    ${emailHeader}
    <div class="greeting">Aura Athletic OS Notification Update</div>
    <p class="paragraph">
      Hello ${userDisplayName}. Here is a structural update from your physiological engine.
    </p>
    <div class="card">
      <div class="card-title">NOTIFICATION DETAILS</div>
      <p class="paragraph" style="font-size: 13px; margin-bottom: 0;">
        ${JSON.stringify(details, null, 2)}
      </p>
    </div>
    ${emailFooter}
  `;
}
