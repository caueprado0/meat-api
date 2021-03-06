import { tokenParser } from './../security/token-parser';
import * as restify from 'restify';
import * as mongoose from 'mongoose'
import { environment } from '../common/environment'
import { Router } from '../common/router'
import { mergePatchBodyParser } from './merge-patch-parser';
import { handleError } from './error-handler';


export class Server {

  application: restify.Server

  initializeDb(): Promise<mongoose.Mongoose> {
    (<any>mongoose).Promise = global.Promise

    var options = {
      server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
      replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
    };

    mongoose.connection.on('error', function(error) {
      console.error('Database connection error:', error);
    });
    
    mongoose.connection.once('open', function() {
      console.log('Database connected!');
    });
    return mongoose.connect(environment.db.url, options)
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: 'meat-api',
          version: '1.0.0'
        })
        
        this.application.use(restify.plugins.queryParser())
        this.application.use(restify.plugins.bodyParser())
        this.application.use(mergePatchBodyParser)
        this.application.use(tokenParser)

        // ROUTES
        for (let router of routers) {
          router.applyRoutes(this.application)
        }

        this.application.listen(environment.server.port, () => {
          resolve(this.application)
        })

        this.application.on('restifyError', handleError)

      } catch (error) {
        reject(error)
      }
    })
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDb().then(() => 
      this.initRoutes(routers).then(() => this)
    )
  }

  shutdown() {
    return mongoose.disconnect().then(() => this.application.close())
  }
}