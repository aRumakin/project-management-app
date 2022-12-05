import { IColumn, ITask } from '@/app/types';

export const getBiggestOrder = (cols: IColumn[] | ITask[] | undefined) =>
  (cols && cols.length > 0)
    ? [...cols].sort((a, b)=>(a.order - b.order))[cols.length-1].order
    : 0;
