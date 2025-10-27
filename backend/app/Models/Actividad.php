// app/Models/Actividad.php
class Actividad extends Model
{
    protected $fillable = [
        'empresa_id', 'fecha', 'hora', 'objetivo', 
        'datos_adicionales', 'estado', 'pedido_entregado', 
        'cantidad_entregada'
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }
}