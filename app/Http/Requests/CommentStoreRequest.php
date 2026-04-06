<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CommentStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'content' => 'required|string|max:1000',
            
            'parent_id' => [
                'nullable',
                // এটি নিশ্চিত করে যে parent_id টি অবশ্যই একটি ভ্যালিড কমেন্ট আইডি হতে হবে
                // এবং সেই কমেন্টটি অবশ্যই বর্তমান পোস্টের (post_id) অধীনে থাকতে হবে
                Rule::exists('comments', 'id')->where(function ($query) {
                    $query->where('post_id', $this->route('post')->id);
                }),
            ],
        ];
    }
}
