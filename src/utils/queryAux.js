import SqlString from 'sqlstring';

const queryAux = (query) => {
    const offset = query.offset
        ? `OFFSET ${SqlString.escape(query.offset)}`
        : '';

    const limit = query.limit ? `LIMIT ${SqlString.escape(query.limit)}` : '';

    const orderBy = query.order
        ? `ORDER BY "${SqlString.escape(query.order).slice(1, -1)}" ${
              query.desc === 'true' ? 'DESC' : 'ASC'
          }`
        : '';

    return { offset, limit, orderBy };
};

export default queryAux;
