const app = require('./app') // Importar la aplicación configurada
const config = require('./utils/config')
const logger = require('./utils/logger')

const PORT = config.PORT || 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
