@extends('vadmin.partials.main')
@section('title')
    Vadmin | Pedido #{{ $order['rawdata']->id }}
@endsection

{{-- HEADER --}}
@section('header')
	@component('vadmin.components.header-list')
		@slot('breadcrums')
		    <li class="breadcrumb-item"><a href="{{ url('vadmin')}}">Inicio</a></li>
            <li class="breadcrumb-item"><a href="{{ route('orders.index')}}">Listado de pedidos</a></li>
            <li class="breadcrumb-item active">Pedido <b>#{{ $order['rawdata']->id }} </b></li>
		@endslot
		@slot('actions')
			{{-- Actions --}}
			<div class="list-actions">
                {{-- Edit --}}
				<button class="EditBtn btn btnGreen Hidden"><i class="icon-pencil2"></i> Editar</button>
				<input id="EditId" type="hidden">
				{{-- Delete --}}
				{{--  THIS VALUE MUST BE THE NAME OF THE SECTION CONTROLLER  --}}
				<input id="ModelName" type="hidden" value="cartitems">
				<button class="DeleteBtn btn btnRed Hidden"><i class="icon-bin2"></i> Eliminar</button>
				<input id="RowsToDeletion" type="hidden" name="rowstodeletion[]" value="">

			</div>
		@endslot
		@slot('searcher')
			@include('vadmin.catalog.payments.searcher')
		@endslot
	@endcomponent
@endsection

{{-- CONTENT --}}
@section('content')
    <div class="row">
        @component('vadmin.components.list')
            @slot('title')
            Pedido #{{ $order['rawdata']->id }}
                    <span class="small"> | {{ transDateT($order['rawdata']->created_at) }}</span><br>
                <p>
                    <b>Cliente: <a href="" data-toggle="modal" data-target="#CustomerDataModal"></b>
                    {{ $order['rawdata']->customer->name }} {{ $order['rawdata']->customer->surname }}</a>
                </p>
            @endslot
            @slot('actions')
                Comprobante:
                <a class="badge badge-green" href="{{ url('vadmin/descargar-comprobante', [$order['rawdata']->id, 'download']) }}" target="_blank">.Pdf</a> |
                <a class="badge badge-green" href="{{ url('vadmin/exportOrderCsv', [$order['rawdata']->id]) }}" target="_blank">.Csv</a> | 
                <a class="badge badge-green" href="{{ url('vadmin/exportOrderXls', [$order['rawdata']->id]) }}" target="_blank">.Xls</a> |
                <a class="badge badge-blue" href="{{ url('vadmin/descargar-comprobante', [$order['rawdata']->id, 'stream']) }}" target="_blank">Ver online</a>
            @endslot
            @slot('tableTitles')
                <th></th>
                <th>Artículo</th>
                <th>Talle - Color - Tela</th>
                <th>P.U.</th>
                <th>Cantidad</th>
                <th>Total</th>
            @endslot
            @slot('tableContent')
                    @foreach($order['rawdata']->items as $item)
                <tr>
                    <td></td>
                    {{-- <td class="w-50">
                        <label class="custom-control custom-checkbox list-checkbox">
                            <input type="checkbox" class="List-Checkbox custom-control-input row-checkbox" data-id="{{ $item->id }}">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description"></span>
                        </label>
                    </td> --}}
                    <td><a href="">{{ $item->article->name }} (#{{ $item->article->code }})</a></td>
                    <td>{{ $item->size }} | {{ $item->color }} | {{ $item->textile }}</td>
                    <td>$ {{ $item->final_price }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td >$ {{ number_format($item->quantity * $item->final_price,2) }}</td>
                </tr>
                @endforeach
                <tr style="border-top: 10px solid #f9f9f9">
                    <td></td><td></td><td></td><td></td>
                    <td><b>SUBTOTAL</b></td>
                    <td><b>$ {{ $order['subTotal'] }}</b></td>
                </tr>
                @if($order['orderDiscount'] != '0')
                <tr>
                    <td></td><td></td><td></td><td></td>
                    <td><b>Descuento: </b> <span class="dont-break">% {{ $order['orderDiscount'] }}</span></td>
                    <td>$ - {{ $order['discountValue'] }}</td>
                </tr>
                @endif
                <tr>
                    <td></td><td></td><td></td><td></td>
                    @if($order['rawdata']->shipping_id != null)
                    <td><b>Envío:</b> {{ $order['rawdata']->shipping->name }}</td>
                    <td>$ {{ $order['shippingCost'] }}</td>
                    @else
                    <td>Envío no seleccionado</td>
                    <td>-</td>
                    @endif
                </tr>
                <tr>
                    <td></td><td></td><td></td><td></td>
                    @if($order['rawdata']->payment_method_id != null)
                    <td><b>Método de pago:</b> {{ $order['rawdata']->payment->name }} (% {{ $order['paymentPercent'] }})</td>
                    <td>${{ $order['paymentCost'] }}</td>
                    @else
                    <td>Método de pago no seleccionado</td>
                    <td>-</td>
                    @endif
                </tr>
                <tr>
                    <td></td><td></td><td></td><td></td>
                    <td><b>TOTAL</b></td>
                    <td><b>$ {{ $order['total'] }}</b></td>
                </tr>                                
            @endslot
        @endcomponent
    </div>
    <!-- Customer data modal -->
    <div class="modal fade" id="CustomerDataModal" tabindex="-1" role="dialog" aria-labelledby="CustomerDataModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Cliente: {{ $customer->name }} {{ $customer->surname }}</h4>
                </div>
                <div class="modal-body">
                    <b>Nombre de Usuario:</b> {{ $customer->username }} <br>
                    <b>E-Mail:</b> {{ $customer->email }} <br>
                    <b>Dirección:</b> {{ $customer->address }} <br>
                    <b>Provincia:</b> {{ $customer->geoprov->name }} <br>
                    <b>Localidad:</b> {{ $customer->geoloc->name }} <br>
                    <b>C.P:</b> {{ $customer->cp }} <br>
                    <hr class="softhr">
                    <b>Teléfono:</b> {{ $customer->phone }} <br>
                    @if($customer->phone2)
                    <b>Teléfono 2:</b> {{ $customer->phone2 }}
                    @endif
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
@endsection