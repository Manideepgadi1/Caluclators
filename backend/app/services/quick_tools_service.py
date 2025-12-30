"""
Quick Tools Services
Single Amount, Irregular Cash Flow, Weighted Average Returns
"""
from app.services.financial_utils import (
    future_value_lumpsum,
    present_value_lumpsum
)
from app.models.quick_tools import (
    SingleAmountInput, SingleAmountOutput,
    IrregularCashFlowInput, IrregularCashFlowOutput,
    WeightedReturnsInput, WeightedReturnsOutput
)


class SingleAmountCalculator:
    """Single Amount PV/FV Calculator"""
    
    @staticmethod
    def calculate(data: SingleAmountInput) -> SingleAmountOutput:
        if data.calculate_type == "present_value":
            # Calculate PV of a future amount
            result = present_value_lumpsum(
                data.amount,
                data.inflation,
                data.years
            )
            calc_type = "present_value"
        else:
            # Calculate FV of a present amount
            result = future_value_lumpsum(
                data.amount,
                data.inflation,
                data.years
            )
            calc_type = "future_value"
        
        return SingleAmountOutput(
            result=result,
            calculation_type=calc_type
        )


class IrregularCashFlowCalculator:
    """Irregular Cash Flow Calculator"""
    
    @staticmethod
    def calculate(data: IrregularCashFlowInput) -> IrregularCashFlowOutput:
        total_value = 0
        
        if data.calculate_type == "present_value":
            # Calculate PV of all future cash flows
            for cf in data.cash_flows:
                pv = present_value_lumpsum(
                    cf.amount,
                    data.discount_rate,
                    cf.years
                )
                total_value += pv
            calc_type = "present_value"
        else:
            # Calculate FV of all cash flows to a common future point
            max_years = max(cf.years for cf in data.cash_flows)
            
            for cf in data.cash_flows:
                # Grow each cash flow to the maximum year
                years_to_grow = max_years - cf.years
                fv = future_value_lumpsum(
                    cf.amount,
                    data.discount_rate,
                    years_to_grow
                )
                total_value += fv
            calc_type = "future_value"
        
        return IrregularCashFlowOutput(
            total_value=total_value,
            calculation_type=calc_type
        )


class WeightedReturnsCalculator:
    """Weighted Average Returns Calculator"""
    
    @staticmethod
    def calculate(data: WeightedReturnsInput) -> WeightedReturnsOutput:
        # Total investment
        total_invested = sum(asset.investment_amount for asset in data.assets)
        
        if total_invested == 0:
            return WeightedReturnsOutput(
                future_value=0,
                weighted_return=0,
                total_invested=0
            )
        
        # Calculate weighted average return
        weighted_return = sum(
            (asset.investment_amount / total_invested) * asset.expected_return
            for asset in data.assets
        )
        
        # Calculate future value using weighted return
        future_value = future_value_lumpsum(
            total_invested,
            weighted_return,
            data.years
        )
        
        return WeightedReturnsOutput(
            future_value=future_value,
            weighted_return=weighted_return,
            total_invested=total_invested
        )
