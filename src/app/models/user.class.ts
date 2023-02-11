export class User {
    id: string;
    name: string;
    mail: string;
    phone: number | string;
    src: string;
    status: string;
    lastLogin: Date;
    pathDefaultImg: string = 'https://firebasestorage.googleapis.com/v0/b/slackclone-6519b.appspot.com/o/images%2Fjf7fewu5rhi?alt=media&token=32f8b383-e477-4829-9e15-fc4230cab06b'

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.mail = obj ? obj.mail : '';
        this.phone = obj ? obj.phone : '';
        this.src = obj ? obj.src : this.pathDefaultImg;
        this.status = obj ? obj.status : '';
        this.lastLogin = obj ? obj.lastLogin : new Date();
    }

    toJson() {
        return {
            name: this.name,
            mail: this.mail,
            phone: this.phone,
            src: this.src,
            status: this.status,
            lastLogin: this.lastLogin,
        };
    }
}