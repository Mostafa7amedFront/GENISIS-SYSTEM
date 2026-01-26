export interface IResponse  {


    success:boolean;
}



export interface IResponseOf<TResult>  extends IResponse{

   value:TResult;
}


export interface IPaginationResponse<TResponse> extends IResponse{
    value: TResponse[]
    pageSize: number
    pageNumber: number
    totalCount: number
    count: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean    

}
export interface IResponsePage<TResponse> extends IResponse{
    value: TResponse
    pageSize: number
    pageNumber: number
    totalCount: number
    count: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean    

}


export interface IPagination {
    pageSize: number;
    pageIndex: number;
    totalCount: number;
    count: number;
    totalPages: number;
    moveNext: boolean;
    movePrevious: boolean;
  }