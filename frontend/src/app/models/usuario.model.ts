
export class  Usuario{

  constructor(
    public nombres: string,
    public nombresProp: string,
    public userName: string,
    public edad: number,
    public correo: string,
    public password: string,
    public direccion: string,
    public genero: boolean,
    public telefono: string,
    public id?: string,
    public external_id?: string,
    public rol?: string,
    public foto?: string
  ){}
}
