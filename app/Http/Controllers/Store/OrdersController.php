<?php

namespace App\Http\Controllers\Store;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Cart;
use App\Customer;
use App\Traits\CartTrait;
use PDF;
use Excel;

class OrdersController extends Controller
{
    use CartTrait;

    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {          
        if($request->id != null)
        {
            $items = Cart::searchId($request->id)->orderBy('id', 'ASC')->paginate(15); 
        } 
        else if($request->status != null)
        {
            if($request->status == 'All')
            {
                $items = Cart::orderBy('created_at', 'DESC')->where('status', '!=','Active')->get();
            } else {
                $items = Cart::searchStatus($request->status)->orderBy('created_at', 'DESC')->get();
            }
        } else {
            $items = Cart::orderBy('created_at', 'DESC')->where('status', '=','Process')->get();
        }

        return view('vadmin.orders.index')->with('items', $items);    
    }

    public function show($id)
    {
        
        $cart = Cart::find($id);
        $customer = Customer::find($cart->customer_id);
        
        $order = $this->calcCartData($cart);
        return view('vadmin.orders.show')
            ->with('order', $order)
            ->with('customer', $customer);
    }


    
    // DOWNLOAD INVOICE PDF
    public function downloadInvoice($id, $action)
    {
        // Return Options
        // return $pdf->dowload($filename.'.pdf');
        // return $pdf->stream($filename.'.pdf');
        $order = Cart::find($id);
        if($order != null){
            $cart = $this->calcCartData($order);
            $pdf = PDF::loadView('store.checkout-invoice', compact('order', 'cart'))->setPaper('a4', 'portrait');
            $filename = 'Comprobante-Pedido-N-'.$order->id;
            if($action == 'stream')
            {
                return $pdf->stream($filename.'.pdf');
            } else {
                return $pdf->download($filename.'.pdf');
            }
            die();

        } else {
            return redirect()->route('store')->with('message','Estás intentando una acción ilegal...');
        }
    }
    

    public function exportOrderXls($id)
    {   
        $order = $this->calcCartData(Cart::find($id));
        Excel::create('Bruna-Pedido-'.$id, function($excel) use($order){
            $excel->sheet('Listado', function($sheet) use($order) { 
                $sheet->getDefaultStyle()->getFont()->setName('Arial');
                $sheet->getDefaultStyle()->getFont()->setSize(12);
                $sheet->getColumnDimension()->setAutoSize(true);
                $sheet->loadView('vadmin.orders.invoiceXls', 
                compact('order'));
            });
        })->export('xls');         
    }

    public function exportOrderCsv($id)
    {   
        $order = $this->calcCartData(Cart::find($id));
        $filename = 'Bruna-Pedido-'.$id.'-Cliente-'.$order['rawdata']->customer->name.' '.$order['rawdata']->customer->surname;
        Excel::create($filename, function($excel) use($order){
            $excel->sheet('Listado', function($sheet) use($order) { 
                $sheet->getDefaultStyle()->getFont()->setName('Arial');
                $sheet->getDefaultStyle()->getFont()->setSize(12);
                $sheet->getColumnDimension()->setAutoSize(true);
                $sheet->getRowDimension(2)->setRowHeight(20);
                $sheet->loadView('vadmin.orders.invoiceXls', 
                compact('order'));
            });
        })->export('csv');         
    }

    
    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    public function edit($id)
    {
        $order = Cart::find($id);
        return view('vadmin.orders.edit')->with('order', $order);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        $this->validate($request,[
            'name' => 'required|min:4|max:250|unique:categories,name,'.$category->id,
        ],[
            'name.required' => 'Debe ingresar un nombre a la categoría',
            'name.unique'   => 'La categoría ya existe'
        ]);
        
        $category->fill($request->all());
        $category->save();

        return redirect()->route('categories.index')->with('message','Categoría editada');
    } 

}