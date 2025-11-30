export class Paging {
    pageIndex: number;
    pageSize: number;
    totalItems: number;

    constructor(pageIndex: number = 1, pageSize: number = 10, totalItems: number = 0) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
    }

    setPage(pageIndex: number, pageSize: number) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
    }

    get skip(): number {
        return (this.pageIndex - 1) * this.pageSize;
    }

    get take(): number {
        return this.pageSize;
    }

    get totalPages(): number {
        return Math.ceil(this.totalItems / this.pageSize);
    }

    reset() {
        this.pageIndex = 1;
        this.pageSize = 10;
        this.totalItems = 0;
    }

    get hasNextPage(): boolean {
        return this.pageIndex < this.totalPages;
    }
    get hasPreviousPage(): boolean {
        return this.pageIndex > 1;
    }

    setTotalItems(totalItems: number) {
        this.totalItems = totalItems;
    }

    setPageIndex(pageIndex: number) {
        this.pageIndex = pageIndex;
    }

    setPageSize(pageSize: number) {
        this.pageSize = pageSize;
    }

    setPaging(pageIndex: number, pageSize: number, totalItems: number) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
    }

    getPagingInfo() {
        return {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            totalItems: this.totalItems,
            totalPages: this.totalPages,
            hasNextPage: this.hasNextPage,
            hasPreviousPage: this.hasPreviousPage,
        };
    }
}