export class Paginated<T> {
    constructor(
        readonly items: T[],
        readonly itemsCount: number,
        readonly pages: number,
        readonly currentPage: number
    ) { }
}