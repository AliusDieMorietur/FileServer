# Logger
* Simple logger, stored in <code>App</code> class and used across all application. 
  Shows time, date, worker and message.
  
| property / method | definition |
| - | - |
| private stream | any |
| private write | any |
| log | (...args: string[]): void |
| error | (...args: string[]): void |
| success | (...args: string[]): void |
| ext | (...args: string[]): void |

# App
* Prepare all required files and have methods to manage app files.

| property / method | definition |
| - | - |
| logger | Logger |
| static | Map<string, Buffer> |
| getStatic | (filePath: string): Buffer |
| getInfo | (token: string): Promise<object> |
| folderTimeout | (folderPath: string, time: number): Promise<void> |
| clearExpired | (): Promise<void> |
| loadFile | (filePath: string, storage: Map<String, Buffer>): Promise<void> |
| loadDirectory | (dirPath: string): Promise<void> |
| start | (): Promise<void> |

# generateToken: () => string;
* Simple function to generate token.

# Channel
* Handles connections and messages.

| property / method | definition |
| - | - |
| private application | App |
| private connection | ws |
| private token | string |
| private buffers | Buffer[] |
| private actions | any |
| constructor | (connection: ws, application: App) |
| message | (data: any): Promise<void> |
| send | (data: any): void |

# Client
* Handles static.

| property / method | definition |
| - | - |
| private req | any |
| private res | any |
| private application | any |
| constructor | (req, res, application: App) |
| static | (): void |

# Launcher
* Create Workers to have more than one instance of server.

| property / method | definition |
| - | - |
| count | number |
| workers | Worker[] |
| private stop | any |
| private startWorker | any |
| start | (): Promise<void> |

# Server
* Creates ws server. Use <code>Channel and Client</code> classes.

| property / method | definition |
| - | - |
| application | App |
| instance | any |
| ws | ws |
| constructor | (application: App) |
| close | (): Promise<void> |

# Database
* Not used yet. Should connect to PostgreSQL and manage data.

| property / method | definition |
| - | - |
| private pool | Pool |
| query | (sql: string, values?) |
| insert | (table, record) |
| select | (table, fields: string[], condition: string, limit: number, offset: number): Promise<any> |
| exist | (condition): Promise<any> |
| delete | (table, condition: string) |
| update | (table, delta, condition: string) |
| close | () |
