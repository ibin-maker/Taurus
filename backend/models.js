const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("usuarios", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

const Preguntas = sequelize.define("Preguntas", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  codigo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "usuario_id"
  }
}, {
  tableName: "preguntas",
  timestamps: false
});

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: "name"
  }
}, {
  tableName: "roles",
  timestamps: false
});

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "role_id"
  }
}, {
  tableName: "usuarios",
  timestamps: false
});


Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });
User.hasMany(Preguntas, { foreignKey: "usuarioId" });
Preguntas.belongsTo(User, { foreignKey: "usuarioId" });

module.exports = {
  sequelize,
  User,
  Role,
  Preguntas,
};
