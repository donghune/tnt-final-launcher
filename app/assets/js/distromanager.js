const { DistributionAPI } = require('helios-core/common')

const ConfigManager = require('./configmanager')

// Old WesterosCraft url.
// exports.REMOTE_DISTRO_URL = 'http://mc.westeroscraft.com/WesterosCraftLauncher/distribution.json'
// TNT 게임 전용 배포망. 로컬 테스트는 localhost:8078, 실배포는 공인 IP 로 바꾼다.
exports.REMOTE_DISTRO_URL = 'https://raw.githubusercontent.com/donghune/tnt-final-launcher/main/distribution.json'

const api = new DistributionAPI(
    ConfigManager.getLauncherDirectory(),
    null, // Injected forcefully by the preloader.
    null, // Injected forcefully by the preloader.
    exports.REMOTE_DISTRO_URL,
    false
)

exports.DistroAPI = api