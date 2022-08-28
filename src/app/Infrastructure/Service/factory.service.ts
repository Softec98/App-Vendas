interface Service<T> {
  new (param: any): T;
}

export class ServiceFactory<T> {

  public createService(ctor: Service<T>, param: any) {
    return new ctor(param);
  }

}