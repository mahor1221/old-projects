module.exports = class Transform {
    transformCollection(items) {
        if (this.withPaginateStatus) {
            return {
                [this.CollectionName()]: items.docs.map(this.transform.bind(this)),
                ...this.paginateItem(items),
            };
        }
        return items.map(this.transform.bind(this));
    }

    paginateItem(items) {
        return {
            total: items.totalDocs,
            limit: items.limit,
            totalPages: items.totalPages,
            page: items.page,
            pagingCounter: items.pagingCounter,
            hasPrevPage: items.hasPrevPage,
            hasNextPage: items.hasNextPage,
            prevPage: items.prevPage,
            nextPage: items.nextPage,
        };
    }

    CollectionName() {
        return "items";
    }

    withPaginate() {
        this.withPaginateStatus = true;
        return this;
    }
};
