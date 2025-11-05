app.post('/video', async (req, res) => {
  id = procesarVideo()
  res.json("video en proceso con id xx");
});


app.get("/proceso",async () => {
    try {
        const res = await axios.get("http://users-service/users");
        return res.data;
    } catch (error) {
        console.error("❌ No se pudo conectar con users-service:", error.message);
        setTimeout(controlador, 1000)
        return { error: "Servicio temporalmente no disponible" };
    }
})

procesarVideo = async () => {
    // cada vez que avanza el proceso, puedo enviar un mensaje a suscripptores
    return "id Proceso"
} 


