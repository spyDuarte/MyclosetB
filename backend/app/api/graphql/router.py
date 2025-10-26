from fastapi import Depends, Request
from strawberry.fastapi import GraphQLRouter

from ...core.auth import get_current_active_user
from ...core.database import get_db
from ...models import User
from ..graphql.schema import schema


async def get_context(
    request: Request,
    session=Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return {"request": request, "session": session, "current_user": current_user}


graphql_app = GraphQLRouter(schema, context_getter=get_context)
