const fs = require('fs');

// Fix leaderboard analytics call
const leaderboardFile = 'src/features/leaderboard/services/leaderboard-data.service.ts';
let content = fs.readFileSync(leaderboardFile, 'utf8');
content = content.replace('this.analytics.trackLeaderboardView(period);', 'this.analytics.trackEvent(\'leaderboard_view\', { period });');
fs.writeFileSync(leaderboardFile, content);
console.log('Fixed leaderboard analytics');

// Fix dashboard-page.tsx - replace getDashboard with actual methods
const dashboardFile = 'src/features/admin/pages/dashboard-page.tsx';
content = fs.readFileSync(dashboardFile, 'utf8');
content = content.replace('adminService.getDashboard()', 'adminService.getEconomyStats()');
fs.writeFileSync(dashboardFile, content);
console.log('Fixed dashboard');

// Fix bootstrap MODE error
const bootstrapFile = 'src/lib/bootstrap/app-bootstrap.ts';
content = fs.readFileSync(bootstrapFile, 'utf8');
content = content.replace('import.meta.env.MODE', 'process.env.NODE_ENV');
content = content.replace('!import.meta.env[key]', '!process.env[key]');
content = content.replace('webApp?.safeAreaInset', 'webApp?.safeAreaInsets');
content = content.replace('return webApp.safeAreaInset', 'return webApp.safeAreaInsets');
fs.writeFileSync(bootstrapFile, content);
console.log('Fixed bootstrap');

// Fix app-initialization imports
const initFile = 'src/lib/bootstrap/app-initialization.tsx';
content = fs.readFileSync(initFile, 'utf8');
content = content.replace('import { TelegramSDK } from', 'import { telegramSDK } from');
content = content.replace('import { UserSyncService } from', 'import { userSyncService } from');
content = content.replace('await SupabaseClient.initialize()', 'await supabase.ensureConnection()');
fs.writeFileSync(initFile, content);
console.log('Fixed initialization');

// Fix env-validator
const envFile = 'src/lib/env-validation/env-validator.ts';
content = fs.readFileSync(envFile, 'utf8');
content = content.replace('import.meta.env.MODE', 'process.env.NODE_ENV');
fs.writeFileSync(envFile, content);
console.log('Fixed env validator');

// Fix error boundary
const errorFile = 'src/lib/error-boundary/error-boundary.tsx';
content = fs.readFileSync(errorFile, 'utf8');
content = content.replace('import.meta.env.DEV', 'process.env.NODE_ENV === \'development\'');
fs.writeFileSync(errorFile, content);
console.log('Fixed error boundary');

console.log('All fixes applied');