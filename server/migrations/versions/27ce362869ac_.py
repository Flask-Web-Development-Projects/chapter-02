"""empty message

Revision ID: 27ce362869ac
Revises: b2af6ee9ed15
Create Date: 2019-05-18 08:15:02.785020

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '27ce362869ac'
down_revision = 'b2af6ee9ed15'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('token', sa.Unicode(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'token')
    # ### end Alembic commands ###
