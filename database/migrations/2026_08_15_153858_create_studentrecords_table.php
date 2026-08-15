<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('studentrecords', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('student_name');
            $table->unsignedInteger('student_id');
            $table->string('course');
            $table->string('year');
            $table->unsignedInteger('phone_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('studentrecords');
    }
};
