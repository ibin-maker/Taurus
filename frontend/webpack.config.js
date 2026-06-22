const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // Configuración básica
    mode: "development",
    entry: "./index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },

    // Resolución: Permite importar .js y .jsx
    resolve: {
        extensions: ['.js', '.jsx']
    },

    // Plugins
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
        })
    ],

    // Módulos y Loaders
    module: {
        rules: [
            // Regla para JS/JSX (usando Babel)
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            // Regla para CSS
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            // *** REGLA PARA IMÁGENES (Asset Module) ***
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource', // Permite a Webpack procesar archivos binarios como imágenes
            }
        ]
    },

    // Servidor de Desarrollo
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        // Frontend en 8080 (requisito del profesor)
        port: 8080,
        open: true,
        hot: true,
        historyApiFallback: true,

        // *** PROXY CORREGIDO: Redirige /Login al puerto 8081 del Backend ***
        proxy: [
            {
                // El contexto indica qué rutas del Frontend redirigir
                context: ['/Login'],
                // Target es la dirección y puerto donde debe correr tu Backend
                target: 'http://localhost:8080',
                secure: false,
                changeOrigin: true,
            }
        ]
    }
}