Sub get_ticker()
   
    Dim ws As Worksheet
    Dim wsCount As Integer
    Dim i As Long
    Dim j As Long
    Dim k As Long
    Dim last_row As Long
    Dim ticker_name As String
    Dim total_volume As Double
    Dim ticker_count As Long
    Dim volume As Long
    Dim n As Long
    Dim first_open as Double
    Dim last_close as Double
    Dim yearly_change as Double
    Dim percent_change as Double
    Dim max_vol as Double
    Dim max_incr as Single
    Dim max_decr as Single
    Dim ticker_max_vol as String
    Dim ticker_max_incr as String
    Dim ticker_max_decr as String
    
    'Count the number of worsheets
    wsCount = ThisWorkbook.Worksheets.Count
    
    'Loop through all worksheets within current workbook
    For i = 1 To wsCount
    
        Set ws = Worksheets(i)
    
        last_row = ws.Cells(Rows.Count, 1).End(xlUp).Row
    
        'Get unique ticker values
        ws.Range("A1:A" & last_row).AdvancedFilter Action:=xlFilterCopy, CopyToRange:=ws.Range("I1"), Unique:=True
  
        'Get total # of unique tickers
        ticker_count = ws.Cells(Rows.Count, 9).End(xlUp).Row - 1
            
        'add headers where metrics will be displayed
        ws.Cells(1, 10) = "Yearly Change"
        ws.Cells(1, 11) = "Percent Change"
        ws.Cells(1, 12) = "Total Stock Volume"
            
        n = 2
        total_volume=0
        max_vol=0
        max_incr=0
        max_decr=0

        'Calculate metrics for each ticker
        For j = 2 To ticker_count
                    
            'initialize to 0 for each ticker
            total_volume = 0
    
            ticker_name = ws.Cells(j, 9).Value
       
            For k = n To last_row
        
                If ws.Cells(k, 1) = ticker_name Then
                    volume = ws.Cells(k, 7).Value
                    total_volume = total_volume + volume

                    If ws.cells(n,1)<>ws.cells(n-1,1) Then
                    first_open=ws.cells(n,3).value
                    Elseif ws.cells(n,1)<>ws.cells(n+1,1) Then
                    last_close=ws.cells(n,6).value
                    End if

                    n = n + 1
                Else

                'Break when ticker name changes
                Exit For
                        
                End If
          
            Next k

            yearly_change=last_close-first_open

            If first_open=0 Then
                percent_change = 0
            Else
                percent_change = yearly_change / first_open
            End If

            ws.cells(j,10).value=yearly_change
            ws.cells(j,11).value=percent_change
            ws.Cells(j, 12).Value = total_volume

            ws.Cells(j, 11).NumberFormat = "0.00%"
                    
            'conditional formating for yearly change
            If yearly_Change > 0 Then
                ws.Cells(j, 10).Interior.ColorIndex = 4
            Else
                ws.Cells(j, 10).Interior.ColorIndex = 3
            End If

            'Calculating max vol, max % increase & max % decrease

            If total_volume>max_vol Then
                max_vol=total_volume
                ticker_max_vol=ticker_name
            End If

            If percent_change>max_incr Then
                max_incr=percent_change
                ticker_max_incr=ticker_name
            End If

            If percent_change<max_decr Then
                max_decr=percent_change
                ticker_max_decr=ticker_name
            End If   

        Next j

        ws.cells(1,16)="Ticker"
        ws.Cells(1,17)="Value"

        'Display greatest % increase
        ws.Cells(2,15)="Greatest % Increase"
        ws.cells(2,16)=ticker_max_incr
        ws.cells(2,17)=max_incr
        ws.Cells(2,17).NumberFormat = "0.00%"

        'Display greatest % decrease
        ws.Cells(3,15)="Greatest % Decrease"
        ws.cells(3,16)=ticker_max_decr
        ws.cells(3,17)=max_decr
        ws.Cells(3,17).NumberFormat = "0.00%"

        'Display max vol
        ws.cells(4,15)="Greatest Total Volume"
        ws.Cells(4,16)=ticker_max_vol
        ws.Cells(4,17)=max_vol

        ws.columns("I:Q").Autofit

                   
    Next i
     
End Sub



