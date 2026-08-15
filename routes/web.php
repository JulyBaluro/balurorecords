<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentrecordsController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('dashboard', [StudentrecordsController::class, 'index'])->name('dashboard');
    Route::post('students', [StudentrecordsController::class, 'store'])->name('students.store');
    Route::put('students/{studentrecords}', [StudentrecordsController::class, 'update'])->name('students.update');
    Route::delete('students/{studentrecords}', [StudentrecordsController::class, 'destroy'])->name('students.destroy');
});

require __DIR__.'/settings.php';
