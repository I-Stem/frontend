
export class ServiceInstance {
  ServiceName: string;

  ServiceDescription: string;

  fileName: string;

  route: string;

  constructor(
    name: string,
    description: string,
    fileName: string,
    route = "/"
  ) {
    this.ServiceDescription = description;
    this.ServiceName = name;
    this.fileName = fileName;
    this.route = route;
  }
}
