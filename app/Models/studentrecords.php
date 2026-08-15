<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class studentrecords extends Model
{
    /** @use HasFactory<\Database\Factories\StudentrecordsFactory> */
    use HasFactory;
    protected $fillable = [
        'student_name',
        'student_id',
        'course',
        'year',
        'phone_number'
    ];
}
