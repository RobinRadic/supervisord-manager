## Supervisord Manager

**Supervisord Manager** is a web-based interface designed to manage Supervisord processes. It provides a user-friendly way to monitor and control processes managed by Supervisord, making it easier to handle process management tasks.

### Features

- **Web Interface**: A simple and intuitive web interface to manage Supervisord processes.
- **User Authentication**: Secure access with user authentication.
- **Process Control**: Start, stop, and restart processes directly from the web interface.
- **Configuration Management**: Manage Supervisord configuration files.
- **Real-time Monitoring**: View real-time status and logs of managed processes.

![Preview](https://i.imgur.com/l2DFjuG.gif)

### Installation
- **install package**
    ```bash
    npm install -g supervisord-manager
    ```
- **configure /etc/supervisor/supervisord.conf**
 
    the `username` does not have to be a system user. you can make one up. its used for authentication in to the RPC_XML.
    same goes for the `password`
    ```ini 
    [unix_http_server]
    file=/var/run/supervisor.sock   ; (the path to the socket file)
    chmod = 0777
    username = <username>
    password = <password>
    
    [inet_http_server]
    port = 127.0.0.1:9005
    username = <username>
    password = <password>
    ```
  

### Simple usage
```bash
supervisord-manager serve --port 1234 \
    --admin-email "admin@admin.com" --admin-password test --admin-name Admin \
    --rpc-host 127.0.0.1:9005 --rpc-username <username> --rpc-password <password>
     
# or simply
supervisord-manager serve --config ./config.json
```
Will host the web interface on http://localhost:1234. You can log in with the admin credentials.

> Note that for full functionality, the user running the server should have read/write access to `/etc/supervisor/conf.d`

### Full installation
Generates configuration file and you can choose between systemd service or supervisor program   
```bash
mkdir ~/.supervisord-manager
cd ~/.supervisord-manager
supervisord-manager init
```

Will generate
```
- config.json
- supervisord-monitor.service
- supervisord-monitor.conf
- install-as-systemd.sh
- install-as-supervisor.sh
```

- Open and edit `config.json` and set all required values
- Open and review `supervisord-monitor.conf` or if you want to use systemd `supervisord-monitor.service`, make sure the usage of node version & run as user are correct
- Run `install-as-supervisor.sh` to symlink `supervisord-monitor.conf` into `/etc/supervisor/conf.d` and reload & start the service
- **OR** Run `install-as-systemd.sh` to symlink `supervisord-monitor.service` into `/lib/systemd/system` and reload & start the service


#### Configuration
The config.json should be structured like this
```ts
export interface Configuration {
    port?: number;
    supervisor?: {
        client?: {
            host?:string
            username?:string
            password?:string
        };
        server?: {
            configurationFilePath?: string;
        }
    };
    users?: Array<{ name: string, email: string, password: string }>;
}
```

Example:
```json
{
    "port": 4035,
    "supervisor": {
        "client": {
            "host": "http://localhost:9005",
            "username": "<username>",
            "password": "<password>"
        },
        "server": {
            "configurationFilePath": "/etc/supervisor/supervisord.conf"
        }
    },
    "users": [
        {"name": "Admin","email": "admin@admin.com","password": "test1234"}
    ]
}
```

### Security
This package is not meant to be accessed by outside hosts. 
It is however possible and safe to use nginx or something likewise to make a reversed proxy.
This should be combined with only allowing a range of trusted IP addresses.

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:4035;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Allow only specific IP addresses
        allow 192.168.1.100;  # Replace with your allowed IP address
        allow 192.168.1.101;  # Replace with another allowed IP address
        deny all;             # Deny all other IP addresses
    }
}
```


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

