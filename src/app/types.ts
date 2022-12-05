export type Languages = 'en' | 'ru';

export interface IErrorResponse {
  status:	number;
  data: {
    statusCode: number;
    message:	string;
  };

}
export interface ISignInOk {
  token: string;
  id: string;
  name: string;
  login: string;
}

export interface IUser {
  name: string;
  login: string;
  _id: string;
}

export interface ITransformUser {
  name: string;
  login: string;
  id: string;
}

export type IUserSignInData = Omit <IUserSignUpData, 'name'>;

export interface IUserSignUpData {
  login: string;
  name: string;
  password: string;
}

export interface IAuthState {
  isLoggedIn: boolean;
  user: ITransformUser | null;
  token: string;
  awaiting?: boolean;
  userCreated?: boolean;
}

export interface IBoard {
  id: string;
  title: string;
  owner: string;
  users: Array<string>;
}

export interface BoardInfo {
  title: string;
  description: string;
}

export type IBoardResponse =
  Omit <IBoard, 'id'> & {
    _id: string;
  };

export type IBoardPost = Omit <IBoard, 'id'>;

export interface IColumn {
  id:	string;
  title:	string;
  order:	number;
  boardId:	string;
}

export type IColumnResponse =
  Omit <IColumn, 'id'> & {
    _id: string;
  };

export type IColumnPost = Omit <IColumn, 'id' | 'boardId'>;

export interface ITask {
  id:	string;
  title:	string;
  order:	number;
  boardId:	string;
  columnId:	string;
  description:	string;
  userId:	string;
  users:	Array<string>;
}

export interface ITasksByColumn {
  data: ITaskResponse[];
}

export interface ITaskSet {
  _id: string;
  order: number;
  columnId: string;
}

export type ITaskResponse =
  Omit <ITask, 'id'> & {
    _id: string;
  };

export type ITaskPost = Omit <ITask, 'id' | 'boardId' | 'columnId'> & {
  columnId?: string;
};
