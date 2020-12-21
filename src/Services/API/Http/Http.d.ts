declare namespace HttpModel {
  export interface IRequestPayload {
    [key: string]: {};
  }

  export interface IFormRequestPayload {}

  export interface IRequestQueryPayload {
    [key: string]: {};
  }
}

export { HttpModel };
