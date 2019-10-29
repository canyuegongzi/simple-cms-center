const config = {
    connectMicroservice: 3002, // 微服务端口
    port: 8882,
    tokenSetTimeOut: 7200,
};

export const redisConfig = {
    name: 'user_token',
    url: 'redis://127.0.0.1:6379/4',
};

export default config;
