"""create initial tables"""

from alembic import op
import sqlalchemy as sa


revision = "0001_create_initial_tables"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(), nullable=False, unique=True),
        sa.Column("full_name", sa.String(), nullable=True),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("category", sa.String(), nullable=False),
        sa.Column("color", sa.String(), nullable=True),
        sa.Column("season", sa.String(), nullable=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_items_owner_id", "items", ["owner_id"])

    op.create_table(
        "outfits",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_outfits_owner_id", "outfits", ["owner_id"])

    op.create_table(
        "events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("event_type", sa.String(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_events_owner_id", "events", ["owner_id"])

    op.create_table(
        "outfit_items",
        sa.Column("outfit_id", sa.Integer(), sa.ForeignKey("outfits.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("item_id", sa.Integer(), sa.ForeignKey("items.id", ondelete="CASCADE"), primary_key=True),
    )

    op.create_table(
        "event_outfits",
        sa.Column("event_id", sa.Integer(), sa.ForeignKey("events.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("outfit_id", sa.Integer(), sa.ForeignKey("outfits.id", ondelete="CASCADE"), primary_key=True),
    )


def downgrade() -> None:
    op.drop_table("event_outfits")
    op.drop_table("outfit_items")
    op.drop_index("ix_events_owner_id", table_name="events")
    op.drop_table("events")
    op.drop_index("ix_outfits_owner_id", table_name="outfits")
    op.drop_table("outfits")
    op.drop_index("ix_items_owner_id", table_name="items")
    op.drop_table("items")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
