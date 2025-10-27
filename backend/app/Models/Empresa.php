// app/Models/Empresa.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $fillable = [
        'nombre', 'giro', 'direccion', 'contacto', 'telefono'
    ];

    public function areas()
    {
        return $this->hasMany(AreaContacto::class);
    }

    public function actividades()
    {
        return $this->hasMany(Actividad::class);
    }
}

