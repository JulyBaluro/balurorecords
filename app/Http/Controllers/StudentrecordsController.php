<?php

namespace App\Http\Controllers;

use App\Models\studentrecords;
use Illuminate\Http\Request;

class StudentrecordsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('dashboard', [
            'students' => students::latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'student_name' => 'required|string|max:100',
            'student_id' => 'required|integer',
            'course' => 'required|string|max:100',
            'year' => 'required|string|max:100',
            'phone_number' => 'required|integer'
        ]);
        studentrecords::create($data);
         return redirect()->route('dashboard');
    }

    /**
     * Display the specified resource.
     */
    // public function show(studentrecords $studentrecords)
    // {
    //     //
    // }

    // /**
    //  * Show the form for editing the specified resource.
    //  */
    // public function edit(studentrecords $studentrecords)
    // {
    //     //
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, studentrecords $studentrecords)
    {
        $data = $request->validate([
            'student_name' => 'required|string|max:100',
            'student_id' => 'required|integer',
            'course' => 'required|string|max:100',
            'year' => 'required|string|max:100',
            'phone_number' => 'required|integer'
        ]);
        $studentrecords->update($data);
        return redirect()->route('dashboard');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(studentrecords $studentrecords)
    {
        $studentrecords->delete();
        return redirect()->route('dashboard');
    }
}
